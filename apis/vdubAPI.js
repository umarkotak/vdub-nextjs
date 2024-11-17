class VdubAPI {
  constructor() {
    if (typeof(window) !== "undefined" && window.location.protocol === "https:") {
    } else {
    }

    this.VdubHost = "http://localhost:29000"
    this.VdubHost = "https://vdubb-be.cloudflare-animapu-1.site"
  }

  // EXAMPLE

  async SamplePost(params) {
    return this.Post(`/api/post`, "", {}, params)
  }

  async SampleGet(authToken, params) {
    return this.Get(`/api/get`, authToken, {}, params)
  }

  async SampleDelete(authToken, params) {
    return this.Delete(`/api/delete/${params.user_id}`, authToken, {}, params)
  }

  async SampleUpdate(authToken, params) {
    return this.Patch(`/api/update/${params.user_id}`, authToken, {}, params)
  }

  // ACTUAL

  async GetTaskList(authToken, h, params) {
    return this.Get(`/vdub/api/dubb/tasks`, authToken, h, params)
  }

  async GetTaskDetail(authToken, h, params) {
    return this.Get(`/vdub/api/dubb/task/${params.task_name}/status`, authToken, h, params)
  }

  async GetTaskLog(authToken, h, params) {
    return this.Get(`/vdub/api/dubb/task/${params.task_name}/log`, authToken, h, params)
  }

  async GetTranscript(authToken, h, params) {
    return this.Get(`/vdub/api/dubb/task/${params.task_name}/transcript/${params.type}`, authToken, h, params)
  }

  async PostTaskCreate(authToken, h, params) {
    return this.Post(`/vdub/api/dubb/start`, authToken, h, params)
  }

  async PostTaskCreateV2(authToken, h, params) {
    return this.Post(`/vdub/api/dubb/startv2`, authToken, h, params)
  }

  async PatchManualUpdateStatus(authToken, h, params) {
    return this.Patch(`/vdub/api/dubb/task/${params.task_name}/status`, authToken, h, params)
  }

  async PatchTaskUpdateSetting(authToken, h, params) {
    return this.Patch(`/vdub/api/dubb/task/${params.task_name}/setting`, authToken, h, params)
  }

  async PatchUpdateTranscript(authToken, h, params) {
    return this.Patch(`/vdub/api/dubb/task/${params.task_name}/transcript`, authToken, h, params)
  }

  async DeleteTask(authToken, h, params) {
    return this.Delete(`/vdub/api/dubb/task/${params.task_name}`, authToken, h, params)
  }

  async PostTranscriptDeleteByIdx(authToken, h, params) {
    return this.Post(`/vdub/api/dubb/task/${params.task_name}/transcript/${params.idx}/delete`, authToken, h, params)
  }

  async PostTranscriptAddBellowByIdx(authToken, h, params) {
    return this.Post(`/vdub/api/dubb/task/${params.task_name}/transcript/${params.idx}/add_next`, authToken, h, params)
  }

  async PostTranscriptGenPreviewVoice(authToken, h, params) {
    return this.Post(`/vdub/api/dubb/task/${params.task_name}/transcript/${params.idx}/gen_preview_voice`, authToken, h, params)
  }

  async PostQuickShiftTranscript(authToken, h, params) {
    return this.Post(`/vdub/api/dubb/task/${params.task_name}/transcript/quick_shift`, authToken, h, params)
  }

  async Get(path, authToken, h, params) {
    var uri = `${this.GenHost()}${path}?${new URLSearchParams(params)}`
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'x-direct-username': this.GenDirectUsername(),
        ...h,
      }
    })
    return response
  }

  async Delete(path, authToken, h, params) {
    var uri = `${this.GenHost()}${path}?${new URLSearchParams(params)}`
    const response = await fetch(uri, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'x-direct-username': this.GenDirectUsername(),
        ...h,
      },
    })
    return response
  }

  async Post(path, authToken, h, params) {
    var uri = `${this.GenHost()}${path}`
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'x-direct-username': this.GenDirectUsername(),
        ...h,
      },
      body: JSON.stringify(params),
    })
    return response
  }

  async Patch(path, authToken, h, params) {
    var uri = `${this.GenHost()}${path}`
    const response = await fetch(uri, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'x-direct-username': this.GenDirectUsername(),
        ...h,
      },
      body: JSON.stringify(params),
    })
    return response
  }

  GenHost() {
    try {
      if (window && localStorage && localStorage.getItem("VDUB:SETTING:SERVER_URL") && localStorage.getItem("VDUB:SETTING:SERVER_URL") !== "") {
        return localStorage.getItem("VDUB:SETTING:SERVER_URL")
      }
      return this.VdubHost
    } catch(e) {
      return this.VdubHost
    }
  }

  GenDirectUsername() {
    try {
      if (window && localStorage && localStorage.getItem("VDUB:SETTING:SERVER_USERNAME") && localStorage.getItem("VDUB:SETTING:SERVER_USERNAME") !== "") {
        return localStorage.getItem("VDUB:SETTING:SERVER_USERNAME")
      }
      return ""
    } catch(e) {
      return ""
    }
  }

  EdgeVoices() {
    return [
      { "value": "id-ID-ArdiNeural", "label": "Male - id-ID-ArdiNeural" },
      { "value": "id-ID-GadisNeural", "label": "Female - id-ID-GadisNeural" },
      { "value": "af-ZA-AdriNeural", "label": "Female - af-ZA-AdriNeural" },
      { "value": "af-ZA-WillemNeural", "label": "Male - af-ZA-WillemNeural" },
      { "value": "am-ET-AmehaNeural", "label": "Male - am-ET-AmehaNeural" },
      { "value": "am-ET-MekdesNeural", "label": "Female - am-ET-MekdesNeural" },
      { "value": "ar-AE-FatimaNeural", "label": "Female - ar-AE-FatimaNeural" },
      { "value": "ar-AE-HamdanNeural", "label": "Male - ar-AE-HamdanNeural" },
      { "value": "ar-BH-AliNeural", "label": "Male - ar-BH-AliNeural" },
      { "value": "ar-BH-LailaNeural", "label": "Female - ar-BH-LailaNeural" },
      { "value": "ar-DZ-AminaNeural", "label": "Female - ar-DZ-AminaNeural" },
      { "value": "ar-DZ-IsmaelNeural", "label": "Male - ar-DZ-IsmaelNeural" },
      { "value": "ar-EG-SalmaNeural", "label": "Female - ar-EG-SalmaNeural" },
      { "value": "ar-EG-ShakirNeural", "label": "Male - ar-EG-ShakirNeural" },
      { "value": "ar-IQ-BasselNeural", "label": "Male - ar-IQ-BasselNeural" },
      { "value": "ar-IQ-RanaNeural", "label": "Female - ar-IQ-RanaNeural" },
      { "value": "ar-JO-SanaNeural", "label": "Female - ar-JO-SanaNeural" },
      { "value": "ar-JO-TaimNeural", "label": "Male - ar-JO-TaimNeural" },
      { "value": "ar-KW-FahedNeural", "label": "Male - ar-KW-FahedNeural" },
      { "value": "ar-KW-NouraNeural", "label": "Female - ar-KW-NouraNeural" },
      { "value": "ar-LB-LaylaNeural", "label": "Female - ar-LB-LaylaNeural" },
      { "value": "ar-LB-RamiNeural", "label": "Male - ar-LB-RamiNeural" },
      { "value": "ar-LY-ImanNeural", "label": "Female - ar-LY-ImanNeural" },
      { "value": "ar-LY-OmarNeural", "label": "Male - ar-LY-OmarNeural" },
      { "value": "ar-MA-JamalNeural", "label": "Male - ar-MA-JamalNeural" },
      { "value": "ar-MA-MounaNeural", "label": "Female - ar-MA-MounaNeural" },
      { "value": "ar-OM-AbdullahNeural", "label": "Male - ar-OM-AbdullahNeural" },
      { "value": "ar-OM-AyshaNeural", "label": "Female - ar-OM-AyshaNeural" },
      { "value": "ar-QA-AmalNeural", "label": "Female - ar-QA-AmalNeural" },
      { "value": "ar-QA-MoazNeural", "label": "Male - ar-QA-MoazNeural" },
      { "value": "ar-SA-HamedNeural", "label": "Male - ar-SA-HamedNeural" },
      { "value": "ar-SA-ZariyahNeural", "label": "Female - ar-SA-ZariyahNeural" },
      { "value": "ar-SY-AmanyNeural", "label": "Female - ar-SY-AmanyNeural" },
      { "value": "ar-SY-LaithNeural", "label": "Male - ar-SY-LaithNeural" },
      { "value": "ar-TN-HediNeural", "label": "Male - ar-TN-HediNeural" },
      { "value": "ar-TN-ReemNeural", "label": "Female - ar-TN-ReemNeural" },
      { "value": "ar-YE-MaryamNeural", "label": "Female - ar-YE-MaryamNeural" },
      { "value": "ar-YE-SalehNeural", "label": "Male - ar-YE-SalehNeural" },
      { "value": "az-AZ-BabekNeural", "label": "Male - az-AZ-BabekNeural" },
      { "value": "az-AZ-BanuNeural", "label": "Female - az-AZ-BanuNeural" },
      { "value": "bg-BG-BorislavNeural", "label": "Male - bg-BG-BorislavNeural" },
      { "value": "bg-BG-KalinaNeural", "label": "Female - bg-BG-KalinaNeural" },
      { "value": "bn-BD-NabanitaNeural", "label": "Female - bn-BD-NabanitaNeural" },
      { "value": "bn-BD-PradeepNeural", "label": "Male - bn-BD-PradeepNeural" },
      { "value": "bn-IN-BashkarNeural", "label": "Male - bn-IN-BashkarNeural" },
      { "value": "bn-IN-TanishaaNeural", "label": "Female - bn-IN-TanishaaNeural" },
      { "value": "bs-BA-GoranNeural", "label": "Male - bs-BA-GoranNeural" },
      { "value": "bs-BA-VesnaNeural", "label": "Female - bs-BA-VesnaNeural" },
      { "value": "ca-ES-EnricNeural", "label": "Male - ca-ES-EnricNeural" },
      { "value": "ca-ES-JoanaNeural", "label": "Female - ca-ES-JoanaNeural" },
      { "value": "cs-CZ-AntoninNeural", "label": "Male - cs-CZ-AntoninNeural" },
      { "value": "cs-CZ-VlastaNeural", "label": "Female - cs-CZ-VlastaNeural" },
      { "value": "cy-GB-AledNeural", "label": "Male - cy-GB-AledNeural" },
      { "value": "cy-GB-NiaNeural", "label": "Female - cy-GB-NiaNeural" },
      { "value": "da-DK-ChristelNeural", "label": "Female - da-DK-ChristelNeural" },
      { "value": "da-DK-JeppeNeural", "label": "Male - da-DK-JeppeNeural" },
      { "value": "de-AT-IngridNeural", "label": "Female - de-AT-IngridNeural" },
      { "value": "de-AT-JonasNeural", "label": "Male - de-AT-JonasNeural" },
      { "value": "de-CH-JanNeural", "label": "Male - de-CH-JanNeural" },
      { "value": "de-CH-LeniNeural", "label": "Female - de-CH-LeniNeural" },
      { "value": "de-DE-AmalaNeural", "label": "Female - de-DE-AmalaNeural" },
      { "value": "de-DE-ConradNeural", "label": "Male - de-DE-ConradNeural" },
      { "value": "de-DE-FlorianMultilingualNeural", "label": "Male - de-DE-FlorianMultilingualNeural" },
      { "value": "de-DE-KatjaNeural", "label": "Female - de-DE-KatjaNeural" },
      { "value": "de-DE-KillianNeural", "label": "Male - de-DE-KillianNeural" },
      { "value": "de-DE-SeraphinaMultilingualNeural", "label": "Female - de-DE-SeraphinaMultilingualNeural" },
      { "value": "el-GR-AthinaNeural", "label": "Female - el-GR-AthinaNeural" },
      { "value": "el-GR-NestorasNeural", "label": "Male - el-GR-NestorasNeural" },
      { "value": "en-AU-NatashaNeural", "label": "Female - en-AU-NatashaNeural" },
      { "value": "en-AU-WilliamNeural", "label": "Male - en-AU-WilliamNeural" },
      { "value": "en-CA-ClaraNeural", "label": "Female - en-CA-ClaraNeural" },
      { "value": "en-CA-LiamNeural", "label": "Male - en-CA-LiamNeural" },
      { "value": "en-GB-LibbyNeural", "label": "Female - en-GB-LibbyNeural" },
      { "value": "en-GB-MaisieNeural", "label": "Female - en-GB-MaisieNeural" },
      { "value": "en-GB-RyanNeural", "label": "Male - en-GB-RyanNeural" },
      { "value": "en-GB-SoniaNeural", "label": "Female - en-GB-SoniaNeural" },
      { "value": "en-GB-ThomasNeural", "label": "Male - en-GB-ThomasNeural" },
      { "value": "en-HK-SamNeural", "label": "Male - en-HK-SamNeural" },
      { "value": "en-HK-YanNeural", "label": "Female - en-HK-YanNeural" },
      { "value": "en-IE-ConnorNeural", "label": "Male - en-IE-ConnorNeural" },
      { "value": "en-IE-EmilyNeural", "label": "Female - en-IE-EmilyNeural" },
      { "value": "en-IN-NeerjaExpressiveNeural", "label": "Female - en-IN-NeerjaExpressiveNeural" },
      { "value": "en-IN-NeerjaNeural", "label": "Female - en-IN-NeerjaNeural" },
      { "value": "en-IN-PrabhatNeural", "label": "Male - en-IN-PrabhatNeural" },
      { "value": "en-KE-AsiliaNeural", "label": "Female - en-KE-AsiliaNeural" },
      { "value": "en-KE-ChilembaNeural", "label": "Male - en-KE-ChilembaNeural" },
      { "value": "en-NG-AbeoNeural", "label": "Male - en-NG-AbeoNeural" },
      { "value": "en-NG-EzinneNeural", "label": "Female - en-NG-EzinneNeural" },
      { "value": "en-NZ-MitchellNeural", "label": "Male - en-NZ-MitchellNeural" },
      { "value": "en-NZ-MollyNeural", "label": "Female - en-NZ-MollyNeural" },
      { "value": "en-PH-JamesNeural", "label": "Male - en-PH-JamesNeural" },
      { "value": "en-PH-RosaNeural", "label": "Female - en-PH-RosaNeural" },
      { "value": "en-SG-LunaNeural", "label": "Female - en-SG-LunaNeural" },
      { "value": "en-SG-WayneNeural", "label": "Male - en-SG-WayneNeural" },
      { "value": "en-TZ-ElimuNeural", "label": "Male - en-TZ-ElimuNeural" },
      { "value": "en-TZ-ImaniNeural", "label": "Female - en-TZ-ImaniNeural" },
      { "value": "en-US-AnaNeural", "label": "Female - en-US-AnaNeural" },
      { "value": "en-US-AndrewMultilingualNeural", "label": "Male - en-US-AndrewMultilingualNeural" },
      { "value": "en-US-AndrewNeural", "label": "Male - en-US-AndrewNeural" },
      { "value": "en-US-AriaNeural", "label": "Female - en-US-AriaNeural" },
      { "value": "en-US-AvaMultilingualNeural", "label": "Female - en-US-AvaMultilingualNeural" },
      { "value": "en-US-AvaNeural", "label": "Female - en-US-AvaNeural" },
      { "value": "en-US-BrianMultilingualNeural", "label": "Male - en-US-BrianMultilingualNeural" },
      { "value": "en-US-BrianNeural", "label": "Male - en-US-BrianNeural" },
      { "value": "en-US-ChristopherNeural", "label": "Male - en-US-ChristopherNeural" },
      { "value": "en-US-EmmaMultilingualNeural", "label": "Female - en-US-EmmaMultilingualNeural" },
      { "value": "en-US-EmmaNeural", "label": "Female - en-US-EmmaNeural" },
      { "value": "en-US-EricNeural", "label": "Male - en-US-EricNeural" },
      { "value": "en-US-GuyNeural", "label": "Male - en-US-GuyNeural" },
      { "value": "en-US-JennyNeural", "label": "Female - en-US-JennyNeural" },
      { "value": "en-US-MichelleNeural", "label": "Female - en-US-MichelleNeural" },
      { "value": "en-US-RogerNeural", "label": "Male - en-US-RogerNeural" },
      { "value": "en-US-SteffanNeural", "label": "Male - en-US-SteffanNeural" },
      { "value": "en-ZA-LeahNeural", "label": "Female - en-ZA-LeahNeural" },
      { "value": "en-ZA-LukeNeural", "label": "Male - en-ZA-LukeNeural" },
      { "value": "es-AR-ElenaNeural", "label": "Female - es-AR-ElenaNeural" },
      { "value": "es-AR-TomasNeural", "label": "Male - es-AR-TomasNeural" },
      { "value": "es-BO-MarceloNeural", "label": "Male - es-BO-MarceloNeural" },
      { "value": "es-BO-SofiaNeural", "label": "Female - es-BO-SofiaNeural" },
      { "value": "es-CL-CatalinaNeural", "label": "Female - es-CL-CatalinaNeural" },
      { "value": "es-CL-LorenzoNeural", "label": "Male - es-CL-LorenzoNeural" },
      { "value": "es-CO-GonzaloNeural", "label": "Male - es-CO-GonzaloNeural" },
      { "value": "es-CO-SalomeNeural", "label": "Female - es-CO-SalomeNeural" },
      { "value": "es-CR-JuanNeural", "label": "Male - es-CR-JuanNeural" },
      { "value": "es-CR-MariaNeural", "label": "Female - es-CR-MariaNeural" },
      { "value": "es-CU-BelkysNeural", "label": "Female - es-CU-BelkysNeural" },
      { "value": "es-CU-ManuelNeural", "label": "Male - es-CU-ManuelNeural" },
      { "value": "es-DO-EmilioNeural", "label": "Male - es-DO-EmilioNeural" },
      { "value": "es-DO-RamonaNeural", "label": "Female - es-DO-RamonaNeural" },
      { "value": "es-EC-AndreaNeural", "label": "Female - es-EC-AndreaNeural" },
      { "value": "es-EC-LuisNeural", "label": "Male - es-EC-LuisNeural" },
      { "value": "es-ES-AlvaroNeural", "label": "Male - es-ES-AlvaroNeural" },
      { "value": "es-ES-ElviraNeural", "label": "Female - es-ES-ElviraNeural" },
      { "value": "es-ES-XimenaNeural", "label": "Female - es-ES-XimenaNeural" },
      { "value": "es-GQ-JavierNeural", "label": "Male - es-GQ-JavierNeural" },
      { "value": "es-GQ-TeresaNeural", "label": "Female - es-GQ-TeresaNeural" },
      { "value": "es-GT-AndresNeural", "label": "Male - es-GT-AndresNeural" },
      { "value": "es-GT-MartaNeural", "label": "Female - es-GT-MartaNeural" },
      { "value": "es-HN-CarlosNeural", "label": "Male - es-HN-CarlosNeural" },
      { "value": "es-HN-KarlaNeural", "label": "Female - es-HN-KarlaNeural" },
      { "value": "es-MX-DaliaNeural", "label": "Female - es-MX-DaliaNeural" },
      { "value": "es-MX-JorgeNeural", "label": "Male - es-MX-JorgeNeural" },
      { "value": "es-NI-FedericoNeural", "label": "Male - es-NI-FedericoNeural" },
      { "value": "es-NI-YolandaNeural", "label": "Female - es-NI-YolandaNeural" },
      { "value": "es-PA-MargaritaNeural", "label": "Female - es-PA-MargaritaNeural" },
      { "value": "es-PA-RobertoNeural", "label": "Male - es-PA-RobertoNeural" },
      { "value": "es-PE-AlexNeural", "label": "Male - es-PE-AlexNeural" },
      { "value": "es-PE-CamilaNeural", "label": "Female - es-PE-CamilaNeural" },
      { "value": "es-PR-KarinaNeural", "label": "Female - es-PR-KarinaNeural" },
      { "value": "es-PR-VictorNeural", "label": "Male - es-PR-VictorNeural" },
      { "value": "es-PY-MarioNeural", "label": "Male - es-PY-MarioNeural" },
      { "value": "es-PY-TaniaNeural", "label": "Female - es-PY-TaniaNeural" },
      { "value": "es-SV-LorenaNeural", "label": "Female - es-SV-LorenaNeural" },
      { "value": "es-SV-RodrigoNeural", "label": "Male - es-SV-RodrigoNeural" },
      { "value": "es-US-AlonsoNeural", "label": "Male - es-US-AlonsoNeural" },
      { "value": "es-US-PalomaNeural", "label": "Female - es-US-PalomaNeural" },
      { "value": "es-UY-MateoNeural", "label": "Male - es-UY-MateoNeural" },
      { "value": "es-UY-ValentinaNeural", "label": "Female - es-UY-ValentinaNeural" },
      { "value": "es-VE-PaolaNeural", "label": "Female - es-VE-PaolaNeural" },
      { "value": "es-VE-SebastianNeural", "label": "Male - es-VE-SebastianNeural" },
      { "value": "et-EE-AnuNeural", "label": "Female - et-EE-AnuNeural" },
      { "value": "et-EE-KertNeural", "label": "Male - et-EE-KertNeural" },
      { "value": "fa-IR-DilaraNeural", "label": "Female - fa-IR-DilaraNeural" },
      { "value": "fa-IR-FaridNeural", "label": "Male - fa-IR-FaridNeural" },
      { "value": "fi-FI-HarriNeural", "label": "Male - fi-FI-HarriNeural" },
      { "value": "fi-FI-NooraNeural", "label": "Female - fi-FI-NooraNeural" },
      { "value": "fil-PH-AngeloNeural", "label": "Male - fil-PH-AngeloNeural" },
      { "value": "fil-PH-BlessicaNeural", "label": "Female - fil-PH-BlessicaNeural" },
      { "value": "fr-BE-CharlineNeural", "label": "Female - fr-BE-CharlineNeural" },
      { "value": "fr-BE-GerardNeural", "label": "Male - fr-BE-GerardNeural" },
      { "value": "fr-CA-AntoineNeural", "label": "Male - fr-CA-AntoineNeural" },
      { "value": "fr-CA-JeanNeural", "label": "Male - fr-CA-JeanNeural" },
      { "value": "fr-CA-SylvieNeural", "label": "Female - fr-CA-SylvieNeural" },
      { "value": "fr-CA-ThierryNeural", "label": "Male - fr-CA-ThierryNeural" },
      { "value": "fr-CH-ArianeNeural", "label": "Female - fr-CH-ArianeNeural" },
      { "value": "fr-CH-FabriceNeural", "label": "Male - fr-CH-FabriceNeural" },
      { "value": "fr-FR-DeniseNeural", "label": "Female - fr-FR-DeniseNeural" },
      { "value": "fr-FR-EloiseNeural", "label": "Female - fr-FR-EloiseNeural" },
      { "value": "fr-FR-HenriNeural", "label": "Male - fr-FR-HenriNeural" },
      { "value": "fr-FR-RemyMultilingualNeural", "label": "Male - fr-FR-RemyMultilingualNeural" },
      { "value": "fr-FR-VivienneMultilingualNeural", "label": "Female - fr-FR-VivienneMultilingualNeural" },
      { "value": "ga-IE-ColmNeural", "label": "Male - ga-IE-ColmNeural" },
      { "value": "ga-IE-OrlaNeural", "label": "Female - ga-IE-OrlaNeural" },
      { "value": "gl-ES-RoiNeural", "label": "Male - gl-ES-RoiNeural" },
      { "value": "gl-ES-SabelaNeural", "label": "Female - gl-ES-SabelaNeural" },
      { "value": "gu-IN-DhwaniNeural", "label": "Female - gu-IN-DhwaniNeural" },
      { "value": "gu-IN-NiranjanNeural", "label": "Male - gu-IN-NiranjanNeural" },
      { "value": "he-IL-AvriNeural", "label": "Male - he-IL-AvriNeural" },
      { "value": "he-IL-HilaNeural", "label": "Female - he-IL-HilaNeural" },
      { "value": "hi-IN-MadhurNeural", "label": "Male - hi-IN-MadhurNeural" },
      { "value": "hi-IN-SwaraNeural", "label": "Female - hi-IN-SwaraNeural" },
      { "value": "hr-HR-GabrijelaNeural", "label": "Female - hr-HR-GabrijelaNeural" },
      { "value": "hr-HR-SreckoNeural", "label": "Male - hr-HR-SreckoNeural" },
      { "value": "hu-HU-NoemiNeural", "label": "Female - hu-HU-NoemiNeural" },
      { "value": "hu-HU-TamasNeural", "label": "Male - hu-HU-TamasNeural" },
      { "value": "is-IS-GudrunNeural", "label": "Female - is-IS-GudrunNeural" },
      { "value": "is-IS-GunnarNeural", "label": "Male - is-IS-GunnarNeural" },
      { "value": "it-IT-DiegoNeural", "label": "Male - it-IT-DiegoNeural" },
      { "value": "it-IT-ElsaNeural", "label": "Female - it-IT-ElsaNeural" },
      { "value": "it-IT-GiuseppeNeural", "label": "Male - it-IT-GiuseppeNeural" },
      { "value": "it-IT-IsabellaNeural", "label": "Female - it-IT-IsabellaNeural" },
      { "value": "ja-JP-KeitaNeural", "label": "Male - ja-JP-KeitaNeural" },
      { "value": "ja-JP-NanamiNeural", "label": "Female - ja-JP-NanamiNeural" },
      { "value": "jv-ID-DimasNeural", "label": "Male - jv-ID-DimasNeural" },
      { "value": "jv-ID-SitiNeural", "label": "Female - jv-ID-SitiNeural" },
      { "value": "ka-GE-EkaNeural", "label": "Female - ka-GE-EkaNeural" },
      { "value": "ka-GE-GiorgiNeural", "label": "Male - ka-GE-GiorgiNeural" },
      { "value": "kk-KZ-AigulNeural", "label": "Female - kk-KZ-AigulNeural" },
      { "value": "kk-KZ-DauletNeural", "label": "Male - kk-KZ-DauletNeural" },
      { "value": "km-KH-PisethNeural", "label": "Male - km-KH-PisethNeural" },
      { "value": "km-KH-SreymomNeural", "label": "Female - km-KH-SreymomNeural" },
      { "value": "kn-IN-GaganNeural", "label": "Male - kn-IN-GaganNeural" },
      { "value": "kn-IN-SapnaNeural", "label": "Female - kn-IN-SapnaNeural" },
      { "value": "ko-KR-HyunsuNeural", "label": "Male - ko-KR-HyunsuNeural" },
      { "value": "ko-KR-InJoonNeural", "label": "Male - ko-KR-InJoonNeural" },
      { "value": "ko-KR-SunHiNeural", "label": "Female - ko-KR-SunHiNeural" },
      { "value": "lo-LA-ChanthavongNeural", "label": "Male - lo-LA-ChanthavongNeural" },
      { "value": "lo-LA-KeomanyNeural", "label": "Female - lo-LA-KeomanyNeural" },
      { "value": "lt-LT-LeonasNeural", "label": "Male - lt-LT-LeonasNeural" },
      { "value": "lt-LT-OnaNeural", "label": "Female - lt-LT-OnaNeural" },
      { "value": "lv-LV-EveritaNeural", "label": "Female - lv-LV-EveritaNeural" },
      { "value": "lv-LV-NilsNeural", "label": "Male - lv-LV-NilsNeural" },
      { "value": "mk-MK-AleksandarNeural", "label": "Male - mk-MK-AleksandarNeural" },
      { "value": "mk-MK-MarijaNeural", "label": "Female - mk-MK-MarijaNeural" },
      { "value": "ml-IN-MidhunNeural", "label": "Male - ml-IN-MidhunNeural" },
      { "value": "ml-IN-SobhanaNeural", "label": "Female - ml-IN-SobhanaNeural" },
      { "value": "mn-MN-BataaNeural", "label": "Male - mn-MN-BataaNeural" },
      { "value": "mn-MN-YesuiNeural", "label": "Female - mn-MN-YesuiNeural" },
      { "value": "mr-IN-AarohiNeural", "label": "Female - mr-IN-AarohiNeural" },
      { "value": "mr-IN-ManoharNeural", "label": "Male - mr-IN-ManoharNeural" },
      { "value": "ms-MY-OsmanNeural", "label": "Male - ms-MY-OsmanNeural" },
      { "value": "ms-MY-YasminNeural", "label": "Female - ms-MY-YasminNeural" },
      { "value": "mt-MT-GraceNeural", "label": "Female - mt-MT-GraceNeural" },
      { "value": "mt-MT-JosephNeural", "label": "Male - mt-MT-JosephNeural" },
      { "value": "my-MM-NilarNeural", "label": "Female - my-MM-NilarNeural" },
      { "value": "my-MM-ThihaNeural", "label": "Male - my-MM-ThihaNeural" },
      { "value": "nb-NO-FinnNeural", "label": "Male - nb-NO-FinnNeural" },
      { "value": "nb-NO-PernilleNeural", "label": "Female - nb-NO-PernilleNeural" },
      { "value": "ne-NP-HemkalaNeural", "label": "Female - ne-NP-HemkalaNeural" },
      { "value": "ne-NP-SagarNeural", "label": "Male - ne-NP-SagarNeural" },
      { "value": "nl-BE-ArnaudNeural", "label": "Male - nl-BE-ArnaudNeural" },
      { "value": "nl-BE-DenaNeural", "label": "Female - nl-BE-DenaNeural" },
      { "value": "nl-NL-ColetteNeural", "label": "Female - nl-NL-ColetteNeural" },
      { "value": "nl-NL-FennaNeural", "label": "Female - nl-NL-FennaNeural" },
      { "value": "nl-NL-MaartenNeural", "label": "Male - nl-NL-MaartenNeural" },
      { "value": "pl-PL-MarekNeural", "label": "Male - pl-PL-MarekNeural" },
      { "value": "pl-PL-ZofiaNeural", "label": "Female - pl-PL-ZofiaNeural" },
      { "value": "ps-AF-GulNawazNeural", "label": "Male - ps-AF-GulNawazNeural" },
      { "value": "ps-AF-LatifaNeural", "label": "Female - ps-AF-LatifaNeural" },
      { "value": "pt-BR-AntonioNeural", "label": "Male - pt-BR-AntonioNeural" },
      { "value": "pt-BR-FranciscaNeural", "label": "Female - pt-BR-FranciscaNeural" },
      { "value": "pt-BR-ThalitaNeural", "label": "Female - pt-BR-ThalitaNeural" },
      { "value": "pt-PT-DuarteNeural", "label": "Male - pt-PT-DuarteNeural" },
      { "value": "pt-PT-RaquelNeural", "label": "Female - pt-PT-RaquelNeural" },
      { "value": "ro-RO-AlinaNeural", "label": "Female - ro-RO-AlinaNeural" },
      { "value": "ro-RO-EmilNeural", "label": "Male - ro-RO-EmilNeural" },
      { "value": "ru-RU-DmitryNeural", "label": "Male - ru-RU-DmitryNeural" },
      { "value": "ru-RU-SvetlanaNeural", "label": "Female - ru-RU-SvetlanaNeural" },
      { "value": "si-LK-SameeraNeural", "label": "Male - si-LK-SameeraNeural" },
      { "value": "si-LK-ThiliniNeural", "label": "Female - si-LK-ThiliniNeural" },
      { "value": "sk-SK-LukasNeural", "label": "Male - sk-SK-LukasNeural" },
      { "value": "sk-SK-ViktoriaNeural", "label": "Female - sk-SK-ViktoriaNeural" },
      { "value": "sl-SI-PetraNeural", "label": "Female - sl-SI-PetraNeural" },
      { "value": "sl-SI-RokNeural", "label": "Male - sl-SI-RokNeural" },
      { "value": "so-SO-MuuseNeural", "label": "Male - so-SO-MuuseNeural" },
      { "value": "so-SO-UbaxNeural", "label": "Female - so-SO-UbaxNeural" },
      { "value": "sq-AL-AnilaNeural", "label": "Female - sq-AL-AnilaNeural" },
      { "value": "sq-AL-IlirNeural", "label": "Male - sq-AL-IlirNeural" },
      { "value": "sr-RS-NicholasNeural", "label": "Male - sr-RS-NicholasNeural" },
      { "value": "sr-RS-SophieNeural", "label": "Female - sr-RS-SophieNeural" },
      { "value": "su-ID-JajangNeural", "label": "Male - su-ID-JajangNeural" },
      { "value": "su-ID-TutiNeural", "label": "Female - su-ID-TutiNeural" },
      { "value": "sv-SE-MattiasNeural", "label": "Male - sv-SE-MattiasNeural" },
      { "value": "sv-SE-SofieNeural", "label": "Female - sv-SE-SofieNeural" },
      { "value": "sw-KE-RafikiNeural", "label": "Male - sw-KE-RafikiNeural" },
      { "value": "sw-KE-ZuriNeural", "label": "Female - sw-KE-ZuriNeural" },
      { "value": "sw-TZ-DaudiNeural", "label": "Male - sw-TZ-DaudiNeural" },
      { "value": "sw-TZ-RehemaNeural", "label": "Female - sw-TZ-RehemaNeural" },
      { "value": "ta-IN-PallaviNeural", "label": "Female - ta-IN-PallaviNeural" },
      { "value": "ta-IN-ValluvarNeural", "label": "Male - ta-IN-ValluvarNeural" },
      { "value": "ta-LK-KumarNeural", "label": "Male - ta-LK-KumarNeural" },
      { "value": "ta-LK-SaranyaNeural", "label": "Female - ta-LK-SaranyaNeural" },
      { "value": "ta-MY-KaniNeural", "label": "Female - ta-MY-KaniNeural" },
      { "value": "ta-MY-SuryaNeural", "label": "Male - ta-MY-SuryaNeural" },
      { "value": "ta-SG-AnbuNeural", "label": "Male - ta-SG-AnbuNeural" },
      { "value": "ta-SG-VenbaNeural", "label": "Female - ta-SG-VenbaNeural" },
      { "value": "te-IN-MohanNeural", "label": "Male - te-IN-MohanNeural" },
      { "value": "te-IN-ShrutiNeural", "label": "Female - te-IN-ShrutiNeural" },
      { "value": "th-TH-NiwatNeural", "label": "Male - th-TH-NiwatNeural" },
      { "value": "th-TH-PremwadeeNeural", "label": "Female - th-TH-PremwadeeNeural" },
      { "value": "tr-TR-AhmetNeural", "label": "Male - tr-TR-AhmetNeural" },
      { "value": "tr-TR-EmelNeural", "label": "Female - tr-TR-EmelNeural" },
      { "value": "uk-UA-OstapNeural", "label": "Male - uk-UA-OstapNeural" },
      { "value": "uk-UA-PolinaNeural", "label": "Female - uk-UA-PolinaNeural" },
      { "value": "ur-IN-GulNeural", "label": "Female - ur-IN-GulNeural" },
      { "value": "ur-IN-SalmanNeural", "label": "Male - ur-IN-SalmanNeural" },
      { "value": "ur-PK-AsadNeural", "label": "Male - ur-PK-AsadNeural" },
      { "value": "ur-PK-UzmaNeural", "label": "Female - ur-PK-UzmaNeural" },
      { "value": "uz-UZ-MadinaNeural", "label": "Female - uz-UZ-MadinaNeural" },
      { "value": "uz-UZ-SardorNeural", "label": "Male - uz-UZ-SardorNeural" },
      { "value": "vi-VN-HoaiMyNeural", "label": "Female - vi-VN-HoaiMyNeural" },
      { "value": "vi-VN-NamMinhNeural", "label": "Male - vi-VN-NamMinhNeural" },
      { "value": "zh-CN-XiaoxiaoNeural", "label": "Female - zh-CN-XiaoxiaoNeural" },
      { "value": "zh-CN-XiaoyiNeural", "label": "Female - zh-CN-XiaoyiNeural" },
      { "value": "zh-CN-YunjianNeural", "label": "Male - zh-CN-YunjianNeural" },
      { "value": "zh-CN-YunxiNeural", "label": "Male - zh-CN-YunxiNeural" },
      { "value": "zh-CN-YunxiaNeural", "label": "Male - zh-CN-YunxiaNeural" },
      { "value": "zh-CN-YunyangNeural", "label": "Male - zh-CN-YunyangNeural" },
      { "value": "zh-CN-liaoning-XiaobeiNeural", "label": "Female - zh-CN-liaoning-XiaobeiNeural" },
      { "value": "zh-CN-shaanxi-XiaoniNeural", "label": "Female - zh-CN-shaanxi-XiaoniNeural" },
      { "value": "zh-HK-HiuGaaiNeural", "label": "Female - zh-HK-HiuGaaiNeural" },
      { "value": "zh-HK-HiuMaanNeural", "label": "Female - zh-HK-HiuMaanNeural" },
      { "value": "zh-HK-WanLungNeural", "label": "Male - zh-HK-WanLungNeural" },
      { "value": "zh-TW-HsiaoChenNeural", "label": "Female - zh-TW-HsiaoChenNeural" },
      { "value": "zh-TW-HsiaoYuNeural", "label": "Female - zh-TW-HsiaoYuNeural" },
      { "value": "zh-TW-YunJheNeural", "label": "Male - zh-TW-YunJheNeural" },
      { "value": "zu-ZA-ThandoNeural", "label": "Female - zu-ZA-ThandoNeural" },
      { "value": "zu-ZA-ThembaNeural", "label": "Male - zu-ZA-ThembaNeural" }
    ]
  }
}

const vdubAPI = new VdubAPI()

export default vdubAPI
