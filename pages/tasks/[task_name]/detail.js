import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useRouter } from 'next/router'
import dynamic from "next/dynamic"

import { LogsIcon, ChevronRight, Circle, CircleCheck, Download, Edit, Eye, Globe, LayoutTemplate, Mic, MoreHorizontal, Pencil, Play, Plus, RefreshCcw, Save, Trash, Volume2Icon, CodeIcon } from "lucide-react"
import ReactPlayer from "react-player"
const Select = dynamic(() => import("react-select"), { ssr: false })

import vdubAPI from "@/apis/vdubAPI"

const stateOptions = [
  {value: "initialized", label: "initialized"},
  {value: "video_downloaded", label: "video_downloaded"},
  {value: "video_audio_generated", label: "video_audio_generated"},
  {value: "video_audio_separated", label: "video_audio_separated"},
  {value: "audio_16khz_generated", label: "audio_16khz_generated"},
  {value: "video_with_instrument_generated", label: "video_with_instrument_generated"},
  {value: "audio_transcripted", label: "audio_transcripted"},
  {value: "transcript_translated", label: "transcript_translated"},
  {value: "audio_generated", label: "audio_generated"},
  {value: "audio_adjusted", label: "audio_adjusted"},
  {value: "dubbed_video_generated", label: "dubbed_video_generated"},
]

export default function TaskDetail() {
  const params = useParams()
  const router = useRouter()

  const [transcriptOriginal, setTranscriptOriginal] = useState([])
  const [transcriptTranslated, setTranscriptTranslated] = useState([])
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [taskDetail, setTaskDetail] = useState({})
  const [updateTaskData, setUpdateTaskData] = useState({
    youtube_url: "",
    voice_name: "",
    voice_rate: "",
    voice_pitch: "",
  })
  const [selectedStatus, setSelectedStatus] = useState("initialized")

  var originalPlayerRef = useRef(null)
  const [originalPlaying, setOriginalPlaying] = useState(false)

  var translatedPlayerRef = useRef(null)
  const [translatedPlaying, setTranslatedPlaying] = useState(false)

  useEffect(() => {
    InitializeData()
  }, [params])

  function InitializeData() {
    setShowVideoPlayer(true)
    GetTaskDetail()
    GetTranscript("original", setTranscriptOriginal)
    GetTranscript("translated", setTranscriptTranslated)
  }

  async function GetTranscript(transcriptType, setFn) {
    try {
      if (!params) { return }

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
      if (!params) { return }

      const response = await vdubAPI.GetTaskDetail("", {}, {
        task_name: params.task_name,
      })
      const body = await response.json()
      if (response.status !== 200) {
        return
      }
      setTaskDetail(body.data)

      setUpdateTaskData({
        youtube_url: body.data.state.youtube_url,
        voice_name: body.data.state.voice_name,
        voice_rate: body.data.state.voice_rate,
        voice_pitch: body.data.state.voice_pitch,
      })
      setSelectedStatus(body.data.state.status)
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

  function OnChange(e, field) {
    if (e?.target?.value) {
      setUpdateTaskData({...updateTaskData, [field]: e.target.value})
    } else if (e?.value) {
      setUpdateTaskData({...updateTaskData, [field]: e.value})
    } else {
      setUpdateTaskData({...updateTaskData, [field]: ""})
    }
  }

  async function PostTaskUpdateVoice() {
    if (!confirm(`Are you sure want to regenerate video with updated voice?`)) { return }

    try {
      const response = await vdubAPI.PostTaskCreateV2("", {}, {
        ...updateTaskData,
        task_name: params.task_name,
        force_start_from: "transcript_translated"
      })
      const body = await response.json()
      if (response.status !== 200) {
        alert(`Start task failed: ${JSON.stringify(body)}`)
        return
      }

      router.push("/tasks")
    } catch (e) { alert(e) }
  }

  async function PostUpdateTranscript() {
    if (!confirm(`Are you sure want to regenerate video with updated transcript?`)) { return }

    var updateTranscriptParams = {
      task_name: params.task_name,
      transcript_data: transcriptTranslated,
    }

    try {
      const response = await vdubAPI.PatchUpdateTranscript("", {}, updateTranscriptParams)
      const body = await response.json()
      if (response.status !== 200) {
        alert(`Update transcript failed: ${body?.error?.message}`)
        return
      }

      alert(`Update transcript successful`)
    } catch (e) { alert(e) }
  }

  async function ManualUpdateStatus() {
    if (!confirm(`Are you sure want to update status to ${selectedStatus}?`)) { return }

    try {
      const response = await vdubAPI.PatchManualUpdateStatus("", {}, {
        task_name: params.task_name,
        status: selectedStatus
      })
      const body = await response.json()
      if (response.status !== 200) {
        alert(`Start task failed: ${JSON.stringify(body)}`)
        return
      }

      InitializeData()
    } catch (e) { alert(e) }
  }

  async function DeleteOneSubtitleByIdx(idx) {
    if (!confirm(`Are you sure want to delete subtitle?`)) { return }

    try {
      const response = await vdubAPI.PostTranscriptDeleteByIdx("", {}, {
        task_name: params.task_name,
        idx: idx
      })
      const body = await response.json()
      if (response.status !== 200) {
        alert(`Delete transcript failed: ${JSON.stringify(body)}`)
        return
      }

      InitializeData()
    } catch (e) { alert(e) }
  }

  async function AddOneBelowSubtitleByIdx(idx) {
    if (!confirm(`Are you sure want to add subtitle?`)) { return }

    try {
      const response = await vdubAPI.PostTranscriptAddBellowByIdx("", {}, {
        task_name: params.task_name,
        idx: idx
      })
      const body = await response.json()
      if (response.status !== 200) {
        alert(`Add transcript failed: ${JSON.stringify(body)}`)
        return
      }

      InitializeData()
    } catch (e) { alert(e) }
  }

  async function PostTaskCreateForRetry(taskName) {
    if (!confirm(`Are you sure want to retry this task?`)) { return }

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

      InitializeData()
    } catch (e) { alert(e) }
  }

  async function PostQuickShiftTranscript(taskName) {
    if (!confirm(`Are you sure want do quick shift transcript?, This action cannot be reverted!`)) { return }

    try {
      const response = await vdubAPI.PostQuickShiftTranscript("", {}, {
        "task_name": taskName,
      })
      const body = await response.json()
      if (response.status !== 200) {
        alert(`Quick shift transcript failed: ${JSON.stringify(body)}`)
        return
      }

      InitializeData()
    } catch (e) { alert(e) }
  }

  return (
    <main className="flex flex-col p-4 gap-2">
      {/* <progress className="progress progress-primary w-full" value={1} max="10"></progress> */}

      <div className="col-span-2 w-full bg-white border border-black p-2 rounded-lg flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center">
          <span className="text-lg font-bold flex items-center"><Circle size={24} className="mr-2" /> {params?.task_name}</span>
          {taskDetail?.state_human?.is_running
            ? <div className="badge badge-neutral flex items-center ml-4">
              <span className="loading loading-spinner loading-xs mr-1"></span>
              <span>task running - {taskDetail?.state_human?.current_status_human}</span>
            </div>
            : taskDetail?.state_human?.completed
            ? <div className="badge badge-neutral flex items-center ml-4">completed</div>
            : <div className="badge badge-error flex items-center ml-4">
              FAIL - {taskDetail?.state_human?.current_status_human}
          </div>}
        </div>
        <div className="flex">
          <Link className="btn btn-primary btn-sm btn-outline" href={`/tasks/${params?.task_name}/log`}>
            <CodeIcon size={14} /> Log
          </Link>
          <button className="btn btn-primary btn-sm btn-outline ml-2" onClick={()=>InitializeData()}>
            <RefreshCcw size={14} /> Refresh
          </button>
          <button className="btn btn-primary btn-sm btn-outline ml-2" onClick={()=>PostTaskCreateForRetry(params?.task_name)}>
            <Play size={14} /> Retry
          </button>
          {/* SIDE DRAWER FOR EDIT */}
          <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary btn-outline btn-sm ml-2"><Edit size={14} /> Edit</label>
            </div>
            <div className="drawer-side z-10">
              <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

              <div className="menu p-4 w-3/4 max-w-lg min-h-full bg-base-200 text-base-content">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold flex items-center"><Circle size={18} className="mr-2" /> {params?.task_name}</span>

                  <button
                    className="btn btn-error btn-outline btn-sm"
                    onClick={()=>DeleteTask(params.task_name)}
                  ><Trash size={14} /> Delete</button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Youtube URL</span>
                    </div>
                    <input
                      type="text"
                      className="input input-sm input-bordered w-full"
                      onChange={(e)=>OnChange(e, "youtube_url")}
                      value={updateTaskData["youtube_url"]}
                      readOnly
                    />
                  </label>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Voice Name</span>
                    </div>
                    <Select
                      className=""
                      isClearable={true}
                      options={vdubAPI.EdgeVoices()}
                      onChange={(e)=>OnChange(e, "voice_name")}
                      value={{value: updateTaskData["voice_name"], label: updateTaskData["voice_name"]}}
                    />
                  </label>
                  <div className="flex gap-1">
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Voice Rate</span>
                      </div>
                      <input
                        type="text"
                        className="input input-sm input-bordered w-full"
                        onChange={(e)=>OnChange(e, "voice_rate")}
                        value={updateTaskData["voice_rate"]}
                      />
                    </label>
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Voice Pitch</span>
                      </div>
                      <input
                        type="text"
                        className="input input-sm input-bordered w-full"
                        onChange={(e)=>OnChange(e, "voice_pitch")}
                        value={updateTaskData["voice_pitch"]}
                      />
                    </label>
                  </div>
                </div>

                <details className="collapse bg-base-200 mt-4">
                  <summary className="collapse-title w-full p-0 min-h-0">
                    <div className="flex justify-between items-center bg-white p-1 h-full mb-0 hover:bg-slate-100">
                      <span>Status: {taskDetail?.state_human?.current_status_human}</span>
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
                          <span>{oneProg.name_human}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>

                <div className="flex items-center justify-start mt-8 gap-2">
                  <div className="tooltip" data-tip="save the new adjusted transcript.">
                    <button
                      className="btn btn-primary btn-outline btn-sm"
                      onClick={()=>PostUpdateTranscript()}
                    ><Save size={14} /> Save Transcript</button>
                  </div>
                  <div className="tooltip" data-tip="save the new setting, no process executed.">
                    <button
                      className="btn btn-primary btn-outline btn-sm"
                      onClick={()=>{}}
                    ><Save size={14} /> Save Setting</button>
                  </div>
                </div>

                <div className="w-full border-b border-solid border-black my-4"></div>

                <div className="flex flex-col gap-4 justify-start text-left">
                  <div className="flex justify-between items-center">
                    <span>Status Action</span>
                  </div>

                  <select value={selectedStatus} onChange={(e)=>{setSelectedStatus(e.target.value)}} className="select select-sm select-bordered w-full">
                    {stateOptions.map((option) => (
                      <option key={option.value} value={option.value} id={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex justify-start gap-2">
                    <div className="tooltip" data-tip="will update status based on select box.">
                      <button className="btn btn-primary btn-outline btn-xs" onClick={()=>ManualUpdateStatus()}>
                        <Pencil size={14} /> Update
                      </button>
                    </div>

                    <div className="tooltip" data-tip="will regenerate voice based on new setting and transcript.">
                      <button
                        className="btn btn-primary btn-outline btn-xs"
                        onClick={()=>PostTaskUpdateVoice()}
                      ><Volume2Icon size={14} /> Regenerate Voice</button>
                    </div>

                    <div className="tooltip" data-tip="will restart the process from selected status.">
                      <button
                        className="btn btn-primary btn-outline btn-xs"
                        onClick={()=>PostTaskUpdateVoice()}
                      ><RefreshCcw size={14} /> Restart From Status</button>
                    </div>
                  </div>
                </div>

                <div className="w-full border-b border-solid border-black my-4"></div>

                <div className="flex flex-col gap-4 justify-start text-left">
                  <div className="flex justify-between items-center">
                    <span>Utility</span>
                  </div>

                  <div className="flex justify-start gap-2">
                    <div className="tooltip" data-tip="will shift the transcript to maximize time gap.">
                      <button
                        className="btn btn-primary btn-outline btn-xs"
                        onClick={()=>PostQuickShiftTranscript()}
                      ><RefreshCcw size={14} /> Quick Shift Transcript</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <details className="collapse bg-base-200">
        <summary className="collapse-title w-full p-0 min-h-0">
          <div className="flex justify-between items-center bg-white p-1 h-full mb-0 hover:bg-slate-100">
            <span>Status: {taskDetail?.state_human?.current_status_human}</span>
            <span><ChevronRight size={14} /></span>
          </div>
        </summary>
        <div className="collapse-content bg-white p-1">
          <ul className="steps steps-horizontal text-xs">
            {taskDetail?.state_human?.progresses.map((oneProg) => (
              <li key={oneProg.name} className={`step ${oneProg.progress === "done" ? "step-success" : ""}`}>
                {oneProg.name_human}
              </li>
            ))}
          </ul>
        </div>
      </details>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="w-full col-span-6">
          <div className="text-xl mb-2">Transcript</div>

          <div className="h-[75vh] overflow-auto">
            <div className="grid grid-cols-2 w-full tracking-wide gap-2 sticky top-0 rounded-lg z-20">
              <div>
                <div className="text-center bg-white py-1 rounded-b-lg border border-black">Original</div>
              </div>

              <div>
                <div className="text-center bg-white py-1 rounded-b-lg border border-black">Translated</div>
              </div>
            </div>

            {transcriptTranslated && transcriptTranslated?.map((oneRow, idx) => (
              <div className="grid grid-cols-2 w-full tracking-wide gap-2 mt-2" key={idx}>
                <div className="mb-12">
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center justify-start gap-1">
                      <button className="btn btn-xs btn-outline">{idx}</button>
                      <div className={`btn btn-xs btn-outline
                        ${(transcriptOriginal[idx]?.value?.length !== transcriptTranslated[idx]?.value?.length
                          ? "btn-error"
                          : "btn-success")}
                      `}>
                        {(transcriptOriginal[idx]?.value?.length !== transcriptTranslated[idx]?.value?.length
                          ? `length diff (${transcriptTranslated[idx]?.value?.length - transcriptOriginal[idx]?.value?.length})`
                          : "length same")}
                      </div>
                    </div>

                    <div className="flex justify-end gap-1">
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={()=>{
                          originalPlayerRef.current?.seekTo(parseTime(transcriptOriginal[idx]?.start_at)/1000);
                          setOriginalPlaying(true);
                          setTranslatedPlaying(false);
                        }}
                      ><Play size={14} /> {transcriptOriginal[idx]?.value.length} chs</button>
                      <input
                        className="input input-xs input-bordered w-[100px]" disabled
                        value={transcriptOriginal[idx]?.start_at}
                      />
                      <input
                        className="input input-xs input-bordered w-[100px]" disabled
                        value={transcriptOriginal[idx]?.end_at}
                      />
                    </div>
                  </div>
                  <textarea
                    className="shadow-sm bg-white rounded-lg p-2 text-sm h-full w-full read-only:text-gray-700" readOnly value={transcriptOriginal[idx]?.value}
                  />
                </div>

                <div className="mb-12">
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-1">
                      <input
                        className="input input-xs input-bordered w-[100px]"
                        value={transcriptTranslated[idx]?.start_at}
                        onChange={(e)=>OnChangeTranscriptStart(idx, e.target.value)}
                      />
                      <input
                        className="input input-xs input-bordered text-right w-[100px]"
                        value={transcriptTranslated[idx]?.end_at}
                        onChange={(e)=>OnChangeTranscriptEnd(idx, e.target.value)}
                      />
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={()=>{
                          translatedPlayerRef.current?.seekTo(Math.floor(parseTime(transcriptTranslated[idx]?.start_at)/1000));
                          setTranslatedPlaying(true);
                          setOriginalPlaying(false);
                        }}
                      ><Play size={14} /> {transcriptTranslated[idx]?.value.length} chs</button>
                    </div>
                    <div className="flex justify-end gap-1">
                      <button className="btn btn-xs btn-outline">{subtractTime(transcriptTranslated[idx]?.end_at, transcriptTranslated[idx]?.start_at)}s</button>
                      <button className="btn btn-xs btn-outline">{
                        (transcriptTranslated[idx]?.value.length / parseFloat(subtractTime(transcriptTranslated[idx]?.end_at, transcriptTranslated[idx]?.start_at))).toFixed(2)
                      } chs/s</button>
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-xs btn-primary btn-outline"><MoreHorizontal size={14} /></div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-box w-52">
                          <li><a onClick={()=>AddOneBelowSubtitleByIdx(idx)}><Plus size={14} /> Add Below</a></li>
                          {/* <li><a><Mic size={14} /> Record</a></li> */}
                          <li><a onClick={()=>DeleteOneSubtitleByIdx(idx)}><Trash size={14} /> Delete</a></li>
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
              </div>
            ))}
          </div>
        </div>

        <div className="w-full col-span-4 flex flex-col gap-4">
          <div className="">
            <div className="flex justify-between items-center bg-white p-2 rounded-lg">
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
                ref={translatedPlayerRef}
                width={"100%"}
                url={`${vdubAPI.VdubHost}/vdub/api/dubb/task/${params?.task_name}/video/translated`}
                playing={translatedPlaying}
                controls={true}
                config={{
                  file: {
                    attributes: {
                      crossOrigin: "true",
                    },
                    tracks: [
                      {kind: 'subtitles', src: `${vdubAPI.VdubHost}/vdub/api/dubb/task/${params?.task_name}/video/subtitle?sub_type=translated`, srcLang: 'en', default: true}
                    ],
                  },
                }}
              />}
            </div>
          </div>

          <div className="">
            <div className="flex justify-between items-center bg-white p-2 rounded-lg">
              <div className="text-lg flex items-center">
                <Circle className="mr-2" size={16} /> Original Video
              </div>
              <div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden mt-2">
              {showVideoPlayer && <ReactPlayer
                ref={originalPlayerRef}
                width={"100%"}
                url={`${vdubAPI.VdubHost}/vdub/api/dubb/task/${params?.task_name}/video/original`}
                playing={originalPlaying}
                controls={true}
                config={{
                  file: {
                    attributes: {
                      crossOrigin: "true",
                    },
                    tracks: [
                      {kind: 'subtitles', src: `${vdubAPI.VdubHost}/vdub/api/dubb/task/${params?.task_name}/video/subtitle`, srcLang: 'en', default: true}
                    ],
                  },
                }}
              />}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function subtractTime(time1, time2) {
  // Parse the time strings into milliseconds
  const time1Ms = parseTime(time1);
  const time2Ms = parseTime(time2);

  // Calculate the difference in milliseconds
  const diffMs = time1Ms - time2Ms;

  // Convert the difference to seconds and microseconds
  const seconds = Math.floor(diffMs / 1000);
  const microseconds = diffMs % 1000;

  return `${seconds}.${String(microseconds).padStart(3, '0')}`;
}

function parseTime(timeString) {
  const parts = timeString.split(':').map(Number);
  return (
    (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000 + parts[3]
  );
}
