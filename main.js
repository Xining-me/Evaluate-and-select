
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js'
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const form = document.getElementById('comment-form')
const input = document.getElementById('comment-input')
const list = document.getElementById('comment-list')

async function loadComments() {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    list.innerHTML = "<p>加载失败，请稍后重试。</p>"
    return
  }

  list.innerHTML = ''
  data.forEach(c => {
    const div = document.createElement('div')
    div.className = 'comment'
    div.innerHTML = `<p>${escapeHtml(c.content)}</p><time>${new Date(c.created_at).toLocaleString()}</time>`
    list.appendChild(div)
  })
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (!text) return
  if (text.length > 200) {
    alert("最多只能输入200字")
    return
  }
  const { error } = await supabase.from('comments').insert({ content: text })
  if (error) {
    alert("提交失败，请稍后重试")
  } else {
    input.value = ''
    loadComments()
  }
})

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

loadComments()
