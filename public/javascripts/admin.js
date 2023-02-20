'use strict'
$(window).on('load', function () {
  console.log('admin')
  if (!getAccount()) {
    Swal.fire({
      icon: 'warning',
      title: '잘못된 접근입니다',
      text: '로그인을 통해 접속해주세요',
      confirmButtonColor: '#ff7777',
    }).then((result) => {
      location.href = '/'
    })
  }
  removeMask()
})
function getAccount() {
  const account = new URL(window.location.href).searchParams.get('acc')
  return account
}
function removeMask() {
  document.getElementById('mask')
  hide()
}

function hide() {
  var div = document.getElementById('mask')
  opacity = Number(window.getComputedStyle(div).getPropertyValue('opacity'))

  if (opacity > 0) {
    opacity = opacity - 0.1
    div.style.opacity = opacity
  } else {
    clearInterval(intervalID)
  }
}

function getUsersListWithAjax() {
  var count

  $.ajax({
    url: '/users',
    method: 'GET',
    dataType: 'JSON',
    async: false,
    data: { account: getAccount() },
    success: (t) => {
      if (t.length > 0)
        for (var e in ($('#booked-body').empty(), t)) bookRender(t[e])

      count = t.length
    },
  })

  return count
}

function getQuestionListWithAjax() {
  var count
  $.ajax({
    url: '/question/data',
    method: 'GET',
    dataType: 'JSON',
    async: false,
    success: (t) => {
      if (($('#question-body').empty(), t.length > 0))
        for (var e in t) questionRender(t[e])
      else nullQuestionRender()

      count = t.length
    },
  })

  return count
}

function bookRender(t) {
  console.log(t)
  const e = $('#booked-body'),
    s = `<td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="text-sm font-medium text-gray-900">
            ${t.name}
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">
          ${t.account}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">
          ${new Date(t.createdAt).toLocaleString()}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">
          ${new Date(t.lastAccess).toLocaleString()}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${'관리자' === t.role ? '관리자' : '시청자'}
        </td>`,
    n = document.createElement('tr')
  ;(n.innerHTML = s), e.append(n)
}

function questionRender(t) {
  const e = $('#question-body'),
    s = new Date(t.createdAt).toLocaleString(),
    n = `<td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="text-sm font-medium text-gray-900">${t.name}</div></div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${s}</td>`,
    i = document.createElement('tr'),
    d = document.createElement('td'),
    k = document.createElement('div')

  ;(i.innerHTML = n),
    (d.classList = 'px-6 py-4 whitespace-nowrap'),
    (k.classList = 'text-sm text-gray-900'),
    (k.innerText = t.context),
    d.append(k),
    i.append(d)
  e.append(i)
}

function nullQuestionRender() {
  const t = $('#question-body'),
    e = document.createElement('tr')
  ;(e.innerHTML =
    '<td class="px-6 py-4 whitespace-nowrap">\n    <div class="flex items-center">\n      <div class="">\n        <div class="text-sm font-medium text-gray-900">현재 입력된 데이터가 없습니다</div>\n      </div>\n    </div>\n  </td>'),
    t.append(e)
}

function setUptime() {
  const t = new Date().getTime() - new Date('2022-11-30 13:00:00').getTime(),
    e = Math.abs(Math.floor(t / 864e5)),
    s = String(Math.abs(Math.floor((t / 36e5) % 24))).padStart(2, '0'),
    n = String(Math.abs(Math.floor((t / 6e4) % 60))).padStart(2, '0'),
    i = String(Math.abs(Math.floor((t / 1e3) % 60))).padStart(2, '0')
  t < 0
    ? $('#start-time').text(`D - ${e}일 ${s}시간 ${n}분 ${i}초`)
    : $('#start-time').text(`${e}일 ${s}시간 ${n}분 ${i}초`)
}

function getQuestionList() {
  $('#users').css('display', 'none'),
    getQuestionListWithAjax(),
    $('#questions').css('display', 'flex')
}

function getUsersList() {
  $('#questions').css('display', 'none'),
    getUsersListWithAjax(),
    $('#users').css('display', 'flex')
}

$(document).ready(() => {
  setUptime(),
    $('#user-count').text(getUsersListWithAjax()),
    $('#question-count').text(getQuestionListWithAjax()),
    setInterval(() => {
      setUptime()
    }, 1e3)
  setInterval(() => {
    $('#user-count').text(getUsersListWithAjax()),
      $('#question-count').text(getQuestionListWithAjax())
  }, 1e4)
}),
  $(window).load(function () {
    removeMask(), getUsersListWithAjax(), getQuestionListWithAjax()
  }),
  $('#download-users-button').on('click', function () {
    location.href = '/users/download'
  }),
  $('#download-question-button').on('click', function () {
    location.href = '/question/download'
  })
