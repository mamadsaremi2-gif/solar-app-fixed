const STORAGE_KEY = 'solar_app_projects_v1'

export function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function saveCurrentProject(project) {
  const projects = loadProjects()

  const existingIndex = projects.findIndex((p) => p.id === project.id)

  if (existingIndex >= 0) {
    projects[existingIndex] = project
  } else {
    projects.unshift(project)
  }

  saveProjects(projects)
  return projects
}

export function deleteProject(projectId) {
  const projects = loadProjects().filter((p) => p.id !== projectId)
  saveProjects(projects)
  return projects
}
