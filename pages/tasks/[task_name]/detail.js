import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { Check, Circle, Download, Eye, Globe, LayoutTemplate, Mic, MoreHorizontal, Plus, Save, Trash } from "lucide-react"
import ReactPlayer from "react-player"

import vdubAPI from "@/apis/vdubAPI"

export default function TaskDetail() {
  const params = useParams()

  const [transcriptOriginal, setTranscriptOriginal] = useState([])
  const [transcriptTranslated, setTranscriptTranslated] = useState([])
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)

  useEffect(() => {
    setShowVideoPlayer(true)
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

  return (
    <main className="flex flex-col min-h-screen p-4 gap-4">
      {/* <progress className="progress progress-primary w-full" value={1} max="10"></progress> */}

      <div className="col-span-2 w-full bg-white p-2 my-2 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">{params?.task_name}</p>
        </div>
        <div>
          <button className="btn btn-error btn-outline btn-sm"><Trash size={14} /></button>
          <button className="btn btn-primary btn-outline btn-sm ml-2"><Save size={14} /> Save</button>
          <button className="btn btn-primary btn-outline btn-sm ml-2"><Check size={14} /> Process</button>
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
