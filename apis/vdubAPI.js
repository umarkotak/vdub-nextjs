class VdubAPI {
  constructor() {
    if (typeof(window) !== "undefined" && window.location.protocol === "https:") {
    } else {
    }

    // this.VdubHost = "http://localhost:29000"
    this.VdubHost = "https://5bt69x77-29000.asse.devtunnels.ms"
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

  async GetTranscript(authToken, h, params) {
    return this.Get(`/vdub/api/dubb/task/${params.task_name}/transcript/${params.type}`, authToken, h, params)
  }

  async PostTaskCreate(authToken, h, params) {
    return this.Post(`/vdub/api/dubb/start`, authToken, h, params)
  }

  async Get(path, authToken, h, params) {
    var uri = `${this.VdubHost}${path}?${new URLSearchParams(params)}`
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...h,
      }
    })
    return response
  }

  async Delete(path, authToken, h, params) {
    var uri = `${this.VdubHost}${path}?${new URLSearchParams(params)}`
    const response = await fetch(uri, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...h,
      },
    })
    return response
  }

  async Post(path, authToken, h, params) {
    var uri = `${this.VdubHost}${path}`
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...h,
      },
      body: JSON.stringify(params),
    })
    return response
  }

  async Patch(path, authToken, h, params) {
    var uri = `${this.VdubHost}${path}`
    const response = await fetch(uri, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...h,
      },
      body: JSON.stringify(params),
    })
    return response
  }
}

const vdubAPI = new VdubAPI()

export default vdubAPI
