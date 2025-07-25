
const supabase = supabaseJs.createClient('https://YOUR_PROJECT.supabase.co', 'YOUR_PUBLIC_ANON_KEY');
const params = new URLSearchParams(location.search);
const teacherId = params.get('id');

async function renderTeacherAndCourses() {
  const teachers = await fetch('/data/teachers.json').then(r => r.json());
  const teacher = teachers.find(t => t.id === teacherId);
  if (teacher) {
    document.getElementById('teacher-name').textContent = teacher.name;
    document.getElementById('teacher-info').textContent = `所属学院：${teacher.college}`;
  }
  const courses = await fetch('/data/courses.json').then(r => r.json());
  courses.filter(c => c.teacher_id === teacherId)
         .forEach(c => {
           const li = document.createElement('li');
           li.textContent = `${c.name}（${c.semester}）`;
           document.getElementById('course-list').appendChild(li);
         });
}

async function loadComments() {
  const list = document.getElementById('commentList');
  list.innerHTML = '加载中...';
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });
  if (error) {
    list.textContent = '加载失败';
  } else {
    list.innerHTML = '';
    data.forEach(c => {
      const d = document.createElement('div');
      d.className = 'comment-card';
      d.innerHTML = `<p>${c.content}</p><small>${new Date(c.created_at).toLocaleString()}</small>`;
      list.appendChild(d);
    });
  }
}

document.getElementById('commentForm').addEventListener('submit', async e => {
  e.preventDefault();
  const content = document.getElementById('commentInput').value.trim();
  const status = document.getElementById('submitStatus');
  status.textContent = '';
  if (!content) {
    status.textContent = '评论内容不能为空';
    return;
  }
  const { error } = await supabase.from('comments').insert([
    { teacher_id: teacherId, content, created_at: new Date().toISOString() }
  ]);
  if (error) {
    status.textContent = '提交失败';
  } else {
    status.textContent = '提交成功';
    document.getElementById('commentInput').value = '';
    loadComments();
  }
});

renderTeacherAndCourses();
loadComments();
