const BASE_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users"
const dataPanel = document.querySelector("#data-panel")
const card = document.querySelector(".card")
let user = []
const modalBody = document.querySelector(".modal-body")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#searchInput")
const userPerPage = 48
const paginator = document.querySelector("#paginator")
let searchList = 0
let filterName = []

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
            <button type="button" class="btn btn-danger btn-circle" id="${item.id}"><i class="fa fa-heart icon"></i></button>
            ${item.name}
          </small>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return
  const page = Number(event.target.dataset.page)

  if (filterName.length === 0) {
    renderUserList(getUserByPage(page))
  } else {
    renderUserList(getSearchByPage(page))
  }
})

function renderPaginator(amount) {
  let rawHTML = ""
  const pages = Math.ceil(amount / userPerPage)
  for (let i = 0; i < pages; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getUserByPage(page) {
  const startIndex = (page - 1) * userPerPage
  return user.slice(startIndex, startIndex + userPerPage)
}

function getSearchByPage(page) {
  const startIndex = (page - 1) * userPerPage
  return filterName.slice(startIndex, startIndex + userPerPage)
}

axios.get(`${BASE_URL}`)
  .then((response) => {
    user = [...response.data.results]
    renderUserList(getUserByPage(1))
    renderPaginator(user.length)
  })
  .catch((err) => console.log(err))

function showModal(id) {
  axios.get(`${BASE_URL}/${id}`)
    .then((response) => {
      const info = response.data
      const name = `${info.name} ${info.surname}`
      let profile = ""
      profile = `<div><img src="${info.avatar}" alt="" class="w-100"></div><div class="info">
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUser")) || []
  const person = user.find((person) => person.id === id)

  if (list.some((person) => person.id === id)) {
    return alert("此用戶已在收藏清單中")
  }

  list.push(person)
  localStorage.setItem("favoriteUser", JSON.stringify(list))
}

dataPanel.addEventListener("click", function (event) {
  const id = Number(event.target.id)

  if (event.target.matches(".avatar")) {
    showModal(id)
  } else if (event.target.matches(".btn-danger")) {
    addToFavorite(id)
  }
})

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault()
  const word = searchInput.value.trim().toLowerCase()

  filterName = user.filter((person) =>
    person.name.toLowerCase().includes(word)
  )

  if (filterName.length === 0) {
    alert("Can't find the user")
  } else {
    renderUserList(filterName)
    renderPaginator(filterName.length)
  }
})