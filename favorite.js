const BASE_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users"
const dataPanel = document.querySelector("#data-panel")
const card = document.querySelector(".card")
const user = JSON.parse(localStorage.getItem("favoriteUser"))
const modalBody = document.querySelector(".modal-body")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#searchInput")

function renderUserList(data) {
  let rawHTML = ""

  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3 col-md-2 col-lg-2 mb-2">
        <div class="card" data-toggle="modal"
          data-target="#user-modal"><img src="${item.avatar}" alt="" class="avatar" id="${item.id}">
        </div>
        <div>
          <small class="name">            
            <button type="button" class="btn btn-warning btn-circle" id="${item.id}"><i class="fa fa-times icon"></i></button>
            ${item.name}
          </small>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function showModal(id) {
  axios.get(`${BASE_URL}/${id}`)
    .then((response) => {
      const info = response.data
      const name = `${info.name} ${info.surname}`
      let profile = ""
      profile = `<div><img src="${info.avatar}" alt=""></div><div class="info">
        <div><strong>Name: </strong>${name}</div>
        <div><strong>Email: </strong>${info.email}</div>
        <div><strong>Gender: </strong>${info.gender}</div>
        <div><strong>Age: </strong>${info.age}</div>
        <div><strong>Region: </strong>${info.region}</div>
        <div><strong>Birthday: </strong>${info.birthday}</div></div>`
      modalBody.innerHTML = profile
    })
    .catch((err) => console.log(err))
}

function removeFromFavorite(id) {
  const personIndex = user.findIndex((person) => person.id === id)
  user.splice(personIndex, 1)

  localStorage.setItem("favoriteUser", JSON.stringify(user))
  renderUserList(user)
}

dataPanel.addEventListener("click", function (event) {
  const id = Number(event.target.id)
  console.log(event.target)

  if (event.target.matches(".avatar")) {
    showModal(id)
  } else if (event.target.matches(".btn-warning")) {
    removeFromFavorite(id)
  }
})

renderUserList(user)