import { SaveIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function Setting() {
  const [serverUrl, setServerUrl] = useState("")
  const [serverUsername, setServerUsername] = useState("")

  useEffect(() => {
    InitializeData()
  }, [])

  function InitializeData() {
    setServerUrl(localStorage.getItem("VDUB:SETTING:SERVER_URL"))
    setServerUsername(localStorage.getItem("VDUB:SETTING:SERVER_USERNAME"))
  }

  function SaveSetting() {
    localStorage.setItem("VDUB:SETTING:SERVER_URL", serverUrl)
    localStorage.setItem("VDUB:SETTING:SERVER_USERNAME", serverUsername)
    InitializeData()

    alert("Setting updated!")
  }

  return (
    <main
      className="container mx-auto max-w-[512px]"
    >
      <div className="flex flex-col gap-4">
        <span className="text-2xl">Setting</span>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Server Url</span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            placeholder="http://localhost:29000"
            onChange={(e)=>setServerUrl(e.target.value)}
            value={serverUrl}
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Server Username</span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            placeholder="public"
            onChange={(e)=>setServerUsername(e.target.value)}
            value={serverUsername}
          />
        </label>

        <div className="flex justify-end items-center">
          <button
            className="btn btn-sm btn-primary"
            onClick={()=>SaveSetting()}
          >
            <SaveIcon size={14} /> Save
          </button>
        </div>
      </div>
    </main>
  )
}
