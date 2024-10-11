import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useRouter } from 'next/router'
import dynamic from "next/dynamic"

import { ArrowLeft, Check, ChevronRight, Circle, CircleCheck, CodeIcon, Download, Edit, Eye, Globe, LayoutTemplate, Mic, MoreHorizontal, Pencil, Play, Plus, RefreshCcw, Save, Trash, Volume2Icon } from "lucide-react"
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
  const [taskLogs, setTaskLogs] = useState([])

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
    GetTaskLog()
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

  async function GetTaskLog() {
    try {
      if (!params) { return }

      const response = await vdubAPI.GetTaskLog("", {}, {
        task_name: params.task_name,
      })
      const body = await response.json()
      if (response.status !== 200) {
        return
      }
      setTaskLogs(body.data.logs)
    } catch (e) { console.error(e) }
  }

  return (
    <main className="flex flex-col p-4 gap-2">
      {/* <progress className="progress progress-primary w-full" value={1} max="10"></progress> */}

      <div className="col-span-2 w-full bg-white border border-black p-2 rounded-lg flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center">
          <Link className="btn btn-primary btn-sm btn-outline mr-2" href={`/tasks/${params?.task_name}/detail`}>
            <ArrowLeft size={14} /> Back
          </Link>
          <span className="text-lg font-bold flex items-center"><CodeIcon size={24} className="mr-2" />LOG {params?.task_name}</span>
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

      <div className="container mx-auto max-w-[1024px] flex flex-col gap-3">
        <span className="text-xl">Log</span>

        {taskLogs.map((taskLog, idx) => (
          <div className={`h-10 p-2 rounded-lg ${
            taskLog.Level === "INFO"
            ? "bg-blue-100"
            : taskLog.Level === "ERROR"
            ? "bg-red-100"
            : "bg-white"
          }`} key={`${idx}-${taskLog.Timestamp}`}>
            <span>{taskLog.Level}</span>
            <span> | </span>
            <span>{taskLog.Message}</span>
          </div>
        ))}
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
