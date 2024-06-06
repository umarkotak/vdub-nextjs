import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from 'next/router'

import { Check, ChevronRight, Circle, CircleCheck, Download, Edit, Eye, Globe, LayoutTemplate, Mic, MoreHorizontal, Plus, Save, Trash } from "lucide-react"
import ReactPlayer from "react-player"

import vdubAPI from "@/apis/vdubAPI"

export default function TaskDetail() {
  const params = useParams()
  const router = useRouter()

  const [transcriptOriginal, setTranscriptOriginal] = useState([])
  const [transcriptTranslated, setTranscriptTranslated] = useState([])
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [taskDetail, setTaskDetail] = useState({})

  useEffect(() => {
    setShowVideoPlayer(true)
    GetTaskDetail()
    GetTranscript("original", setTranscriptOriginal)
    GetTranscript("translated", setTranscriptTranslated)
  }, [params])

  async function GetTranscript(transcriptType, setFn) {
    try {
      const response = await vdubAPI.GetTranscript("", {}, {
        task_name: params.task_name,
        type: transcriptType,
      })
      const body = await response.json()
      if (response.status !== 200) {
        return
      }
      setFn(body.data.transcript_line)
    } catch (e) { console.error(e) }
  }

  async function GetTaskDetail() {
    try {
      const response = await vdubAPI.GetTaskDetail("", {}, {
        task_name: params.task_name,
      })
      const body = await response.json()
      if (response.status !== 200) {
        return
      }
      setTaskDetail(body.data)
    } catch (e) { console.error(e) }
  }

  function OnChangeTranscriptVal(idx, v) {
    var tmpArr = [...transcriptTranslated]
    tmpArr[idx] = transcriptTranslated[idx]

    tmpArr[idx].value = v

    setTranscriptTranslated(tmpArr)
  }

  function OnChangeTranscriptStart(idx, v) {
    var tmpArr = [...transcriptTranslated]
    tmpArr[idx] = transcriptTranslated[idx]

    tmpArr[idx].start_at = v

    setTranscriptTranslated(tmpArr)
  }

  function OnChangeTranscriptEnd(idx, v) {
    var tmpArr = [...transcriptTranslated]
    tmpArr[idx] = transcriptTranslated[idx]

    tmpArr[idx].end_at = v

    setTranscriptTranslated(tmpArr)
  }

  async function DeleteTask(taskName) {
    if (!confirm("Are you sure want to delete this task?")) { return }

    try {
      const response = await vdubAPI.DeleteTask("", {}, {task_name: taskName})
      if (response.status !== 200) {
        return
      }
      router.push("/tasks")
    } catch (e) { console.error(e) }
  }

  return (
    <main className="flex flex-col min-h-screen p-4 gap-4">
      {/* <progress className="progress progress-primary w-full" value={1} max="10"></progress> */}

      <div className="col-span-2 w-full bg-white p-2 my-2 rounded-lg flex justify-between items-center">
        <div>
          <span className="text-lg font-bold flex items-center"><Circle size={24} className="mr-2" /> {params?.task_name}</span>
        </div>
        <div>
          <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary btn-outline btn-sm"><Edit size={14} /> Edit</label>
            </div>
            <div className="drawer-side z-10">
              <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

              <div className="menu p-4 w-3/4 max-w-md min-h-full bg-base-200 text-base-content">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold flex items-center"><Circle size={18} className="mr-2" /> {params?.task_name}</span>

                  <button
                    className="btn btn-error btn-outline btn-sm"
                    onClick={()=>DeleteTask(params.task_name)}
                  ><Trash size={14} /> Delete</button>
                </div>

                <details className="collapse bg-base-200 mt-4">
                  <summary className="collapse-title w-full p-0 min-h-0">
                    <div className="flex justify-between items-center bg-white p-1 h-full mb-0">
                      <span>Status detail</span>
                      <span><ChevronRight size={14} /></span>
                    </div>
                  </summary>
                  <div className="collapse-content bg-white p-1">
                    <div className="flex flex-col gap-2">
                      {taskDetail?.state_human?.progresses.map((oneProg) => (
                        <div key={oneProg.name} className="flex items-center">
                          {oneProg.progress === "done" ?
                            <CircleCheck size={18} className="mr-2 text-success" /> :
                            <Circle size={18} className="mr-2" />
                          }
                          <span>{oneProg.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>

                <div className="flex items-center justify-end mt-4">
                  <button className="btn btn-primary btn-outline btn-sm"><Save size={14} /> Save</button>
                  <button className="btn btn-primary btn-outline btn-sm ml-2"><Check size={14} /> Process</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <div className="text-xl mb-2">Transcript</div>

          <div className="grid grid-cols-2 w-full tracking-wide gap-2">
            <div>
              <div className="text-center font-bold border-x border-gray-400">Original</div>
            </div>

            <div>
              <div className="text-center font-bold border-x border-gray-400">Translated</div>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full tracking-wide gap-2 mt-4">
            {transcriptOriginal?.map((oneRow, idx) => (
              <>
                <div className="mb-12">
                  <div className="flex justify-between text-sm mb-1">
                    <div>
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className={`btn btn-xs btn-outline
                          ${(transcriptOriginal[idx]?.value?.length !== transcriptTranslated[idx]?.value?.length ? "btn-error" : "btn-success")}
                        `}>
                          {(transcriptOriginal[idx]?.value?.length !== transcriptTranslated[idx]?.value?.length ? `length diff (${transcriptTranslated[idx]?.value?.length - transcriptOriginal[idx]?.value?.length})` : "length same")}
                        </div>
                      </div>
                    </div>

                    <input
                      className="input input-xs input-bordered"
                      value={transcriptTranslated[idx]?.start_at}
                      onChange={(e)=>OnChangeTranscriptStart(idx, e.target.value)}
                    />
                  </div>
                  <textarea
                    className="shadow-sm bg-white rounded-lg p-2 text-sm h-full w-full read-only:text-gray-700" readOnly value={transcriptOriginal[idx].value}
                  />
                </div>

                <div className="mb-12">
                  <div className="flex justify-between text-sm mb-1">
                    <input
                      className="input input-xs input-bordered text-right"
                      value={transcriptTranslated[idx]?.end_at}
                      onChange={(e)=>OnChangeTranscriptEnd(idx, e.target.value)}
                    />
                    <div>
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-xs btn-primary btn-outline"><MoreHorizontal size={14} /></div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-box w-52">
                          <li><a><Mic size={14} /> Record</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="shadow-sm bg-white rounded-lg p-2 text-sm h-full w-full"
                    value={transcriptTranslated[idx]?.value}
                    onChange={(e)=>OnChangeTranscriptVal(idx, e.target.value)}
                  />
                </div>
              </>
            ))}
          </div>
        </div>

        <div className="w-full">
          <div>
            <div className="text-lg flex items-center"><Circle className="mr-2" size={16} /> Original Video</div>

            <div className="border rounded-lg overflow-hidden mt-2">
              {showVideoPlayer && <ReactPlayer
                className="border rounded-lg overflow-hidden"
                width={"100%"}
                url={`${vdubAPI.VdubHost}/vdub/api/dubb/task/${params?.task_name}/video/original`}
                playing={false}
                controls={true}
              />}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center">
              <div className="text-lg flex items-center">
                <Globe className="mr-2" size={16} /> Translated Video
              </div>
              <div>
                <a
                  href={`${vdubAPI.VdubHost}/vdub/api/dubb/task/${params?.task_name}/video/translated`}
                  className="btn btn-primary btn-xs btn-outline"
                  target="_blank"
                  download
                >
                  <Download className="mr-2" size={14} /> Download
                </a>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden mt-2">
              {showVideoPlayer && <ReactPlayer
                width={"100%"}
                url={`${vdubAPI.VdubHost}/vdub/api/dubb/task/${params?.task_name}/video/translated`}
                playing={false}
                controls={true}
              />}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
