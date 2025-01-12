import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/router'

import { Eye, LayoutTemplate, Plus, Trash } from "lucide-react"

import vdubAPI from "@/apis/vdubAPI"

export default function TaskList() {
  const router = useRouter()

  const [taskList, setTaskList] = useState([
    {
      "name": "loading-data-1",
      "current_status_human": "N/A",
      "is_running": false,
      "progress_summary": "10/10",
    },
    {
      "name": "loading-data-2",
      "current_status_human": "N/A",
      "is_running": true,
      "progress_summary": "7/10",
    },
  ])
  const [serverOnline, setServerOnline] = useState(true)

  useEffect(() => {
    GetTaskList()
  }, [])

  var minutes = 0.1
  const intervalRef = useRef(null)
  useEffect(() => {
    const execCallback = () => {
      GetTaskList()
    }
    intervalRef.current = setInterval(execCallback, minutes * 60 * 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  async function GetTaskList() {
    try {
      const response = await vdubAPI.GetTaskList("", {}, {})
      const body = await response.json()
      if (response.status !== 200) {
        return
      }
      setTaskList(body.data)
      setServerOnline(true)
    } catch (e) {
      setTaskList([])
      setServerOnline(false)
      console.error(e)
    }
  }

  async function PostTaskCreateForRetry(taskName) {
    try {
      const response = await vdubAPI.PostTaskCreateV2("", {}, {
        "task_name": taskName,
        "youtube_url": "retry",
        "voice_name": "retry",
        "voice_rate": "retry",
        "voice_pitch": "retry",
      })
      const body = await response.json()
      if (response.status !== 200) {
        alert(`Retry task failed: ${JSON.stringify(body)}`)
        return
      }

      router.push("/tasks")
    } catch (e) { alert(e) }
  }

  async function DeleteTask(taskName) {
    if (!confirm("Are you sure want to delete this task?")) { return }

    try {
      const response = await vdubAPI.DeleteTask("", {}, {task_name: taskName})
      if (response.status !== 200) {
        return
      }
      GetTaskList()
    } catch (e) { console.error(e) }
  }

  return (
    <main className="flex flex-col min-h-screen p-4 gap-4">
      {!serverOnline && <div className="flex items-center bg-error text-white p-2 rounded-lg">
        Sorry, server is offline.
      </div>}

      <div className="flex justify-between items-center">
        <span className="flex gap-2 text-xl items-center"><LayoutTemplate /> Task List</span>
        <Link href="/tasks/new" className="btn btn-sm btn-primary btn-outline"><Plus size={14} /> New Task</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {taskList.map((oneTask)=>(
          <div key={oneTask.name} className="flex flex-col rounded-lg overflow-hidden w-full bg-white shadow-sm">
            <div className="w-full">
              <div className="w-full relative overflow-hidden">
                <Link
                  href={`/tasks/${oneTask.name}/detail`}
                  className="overflow-hidden"
                >
                  <img
                    // src="https://placehold.co/200x200"
                    src={`${vdubAPI.GenHost()}/vdub/api/dubb/task/${oneTask.name}/video/snapshot`}
                    className="w-full h-[200px] hover:scale-110 duration-150 overflow-hidden object-cover"
                  />
                </Link>
                {oneTask.is_running &&
                  <div className="absolute top-2 right-2 badge badge-neutral flex items-center">
                    <span className="loading loading-spinner loading-xs mr-1"></span>
                    <span>task running</span>
                  </div>
                }
                {!oneTask.is_running && oneTask.current_status_human !== "Completed" &&
                  <button
                    className="absolute top-2 right-2 btn btn-xs btn-primary btn-outline"
                    onClick={()=>PostTaskCreateForRetry(oneTask.name)}
                  >
                    <span>retry</span>
                  </button>
                }
              </div>
            </div>
            <div className="w-full p-2 tracking-wide">
              <p className="text-sm font-bold break-all">{oneTask.name}</p>
              <p className="text-sm mt-1 mb-[-10px] break-all">{oneTask.current_status_human}</p>
              <progress className="progress progress-primary w-full" value={parseInt(oneTask.progress_summary)} max="10"></progress>

              <div className="flex justify-between mt-8">
                <button
                  className="btn btn-xs btn-error btn-outline"
                  onClick={()=>DeleteTask(oneTask.name)}
                ><Trash size={14} /></button>

                <Link
                  href={`/tasks/${oneTask.name}/detail`}
                  className="btn btn-xs btn-primary btn-outline"
                  // disabled={oneTask.current_status_human !== "Completed"}
                ><Eye size={14} /> Detail</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
