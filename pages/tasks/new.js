import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/router'

import { Plus } from "lucide-react"

import vdubAPI from "@/apis/vdubAPI"

export default function TaskNew() {
  const router = useRouter()

  const [createParams, setCreateParams] = useState({
    "task_name": "",
    "youtube_url": "",
    "voice_name": "id-ID-ArdiNeural",
    "voice_rate": "+1%",
    "voice_pitch": "-15Hz",
  })

  async function PostTaskCreate() {
    try {
      const response = await vdubAPI.PostTaskCreate("", {}, createParams)
      const body = await response.json()
      if (response.status !== 200) {
        alert(`Start task failed: ${JSON.stringify(body)}`)
        return
      }

      router.push()
    } catch (e) { alert(e) }
  }

  function OnChange(e, field) {
    if (e?.target?.value) {
      setCreateParams({...createParams, [field]: e.target.value})
    } else if (e?.value) {
      setCreateParams({...createParams, [field]: e.value})
    } else {
      setCreateParams({...createParams, [field]: ""})
    }
  }

  return (
    <main className="container mx-auto max-w-md p-4">
      <div className="flex flex-col bg-white rounded-lg p-2 w-full">
        <span className="flex text-xl items-center"><Plus /> New Task</span>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Task Name</span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            onChange={(e)=>OnChange(e, "task_name")}
            value={createParams["task_name"]}
          />
          <div className="label">
            <span className="label-text-alt">name of task should be unique and do not contain space</span>
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Youtube URL</span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            onChange={(e)=>OnChange(e, "youtube_url")}
            value={createParams["youtube_url"]}
          />
          <div className="label">
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Voice Name</span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            onChange={(e)=>OnChange(e, "voice_name")}
            value={createParams["voice_name"]}
          />
          <div className="label">
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Voice Rate</span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            onChange={(e)=>OnChange(e, "voice_rate")}
            value={createParams["voice_rate"]}
          />
          <div className="label">
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Voice Pitch</span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            onChange={(e)=>OnChange(e, "voice_pitch")}
            value={createParams["voice_pitch"]}
          />
          <div className="label">
          </div>
        </label>
        <div className="mt-2 flex justify-between">
          <div>
          </div>

          <button
            className="btn btn-sm btn-primary btn-outline"
            onClick={()=>PostTaskCreate()}
          >
            Execute!
          </button>
        </div>
      </div>
    </main>
  )
}
