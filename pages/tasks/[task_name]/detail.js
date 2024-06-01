import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { Check, Eye, LayoutTemplate, Plus, Trash } from "lucide-react"
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

  return (
    <main className="flex flex-col min-h-screen p-4 gap-4">
      {/* <progress className="progress progress-primary w-full" value={1} max="10"></progress> */}

      <div className="col-span-2 w-full bg-white p-2 my-2 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">{params?.task_name}</p>
        </div>
        <div>
          <button className="btn btn-error btn-outline btn-sm"><Trash size={14} /></button>
          <button className="btn btn-primary btn-outline btn-sm ml-2"><Check size={14} /> Process</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <div className="text-xl mb-2">Transcript</div>

          <div className="grid grid-cols-2 w-full tracking-wide gap-2">
            <div>
              <div className="text-center font-bold border-x border-black">Original</div>
            </div>

            <div>
              <div className="text-center font-bold border-x border-black">Translated</div>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full tracking-wide gap-2 mt-4">
            {transcriptOriginal.map((oneRow, idx) => (
              <>
                <div className="mb-10">
                  <div className="flex justify-end text-sm mb-1">
                    <input
                      className="input input-xs input-bordered" value={transcriptOriginal[idx].start_at}
                    />
                  </div>
                  <textarea
                    className="shadow-sm bg-white rounded-lg p-2 text-sm h-full w-full read-only:text-gray-700" readOnly value={transcriptOriginal[idx].value}
                  />
                </div>

                <div className="mb-10">
                  <div className="flex justify-start text-sm mb-1">
                    <input
                      className="input input-xs input-bordered text-right" value={transcriptOriginal[idx].end_at}
                    />
                  </div>
                  <textarea
                    className="shadow-sm bg-white rounded-lg p-2 text-sm h-full w-full" value={transcriptTranslated[idx]?.value}
                  />
                </div>
              </>
            ))}
          </div>
        </div>

        <div className="w-full">
          <div>
            <p className="text-lg">Original Video</p>

            <div className="border rounded-lg overflow-hidden">
              {showVideoPlayer && <ReactPlayer
                className="border rounded-lg overflow-hidden"
                width={"100%"}
                url={"http://localhost:29000/vdub/api/dubb/task/kurz-1/video/original"}
                playing={false}
                controls={true}
              />}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-lg">Translated Video</p>

            <div className="border rounded-lg overflow-hidden">
              {showVideoPlayer && <ReactPlayer
                width={"100%"}
                url={"http://localhost:29000/vdub/api/dubb/task/kurz-1/video/translated"}
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
