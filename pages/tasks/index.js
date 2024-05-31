import Link from "next/link"
import { useEffect, useState } from "react"

import { Eye, LayoutTemplate, Plus } from "lucide-react"

import vdubAPI from "@/apis/vdubAPI"

export default function TaskList() {

  const [taskList, setTaskList] = useState([
    {
      "name": "task-public-kurz-1",
      "status": "dubbed_video_generated",
      "is_running": false,
      "progress_summary": "10/10",
    },
    {
      "name": "task-public-kurz-1",
      "status": "dubbed_video_generated",
      "is_running": true,
      "progress_summary": "7/10",
    },
  ])

  useEffect(() => {
    GetTaskList()
  }, [])

  async function GetTaskList() {
    try {
      const response = await vdubAPI.GetTaskList("", {}, {})
      const body = await response.json()
      if (response.status !== 200) {
        return
      }
      setTaskList(body.data)
    } catch (e) { console.error(e) }
  }

  return (
    <main className="flex flex-col min-h-screen p-4 gap-4">
      <div className="flex justify-between items-center">
        <span className="flex gap-2 text-xl items-center"><LayoutTemplate /> Task List</span>
        <Link href="/tasks/new" className="btn btn-sm btn-primary btn-outline"><Plus size={14} /> New Task</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {taskList.map((oneTask)=>(
          <div key={oneTask.name} className="flex flex-col rounded-lg overflow-hidden w-full bg-white shadow-sm">
            <div className="w-full">
              <div className="w-full relative">
                <img src="https://placehold.co/200x200" className="w-full h-[200]" />
                {oneTask.is_running &&
                  <div className="absolute top-2 right-2 badge badge-neutral">on progress</div>
                }
              </div>
            </div>
            <div className="w-full p-2 tracking-wide">
              <p className="text-sm font-bold break-all">{oneTask.name}</p>
              <p className="text-sm mt-1 mb-[-10px] break-all">{oneTask.status}</p>
              <progress className="progress progress-primary w-full" value={parseInt(oneTask.progress_summary)} max="10"></progress>

              <div className="flex justify-end mt-8">
                <Link href={`/tasks/${oneTask.name}/detail`} className="btn btn-xs btn-primary btn-outline"><Eye size={14} /> Detail</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
