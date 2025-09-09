
import { useEffect, useState } from 'react'
import * as ProjectService from '../services/projectService'
import * as PaperService from '../services/paperService'
import * as DatasetService from '../services/datasetService'

export default function ResearcherDashboard(){
  const [projects, setProjects] = useState([])
  const [papers, setPapers] = useState([])
  const [datasets, setDatasets] = useState([])

  useEffect(()=>{
    ProjectService.listProjects().then(setProjects).catch(()=>setProjects([]))
    PaperService.listPapers().then(setPapers).catch(()=>setPapers([]))
    DatasetService.listDatasets().then(setDatasets).catch(()=>setDatasets([]))
  },[])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Researcher Home</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4"><h3 className="font-medium">My Projects</h3><p className="text-3xl font-bold mt-2">{projects.length}</p></div>
        <div className="card p-4"><h3 className="font-medium">My Papers</h3><p className="text-3xl font-bold mt-2">{papers.length}</p></div>
        <div className="card p-4"><h3 className="font-medium">Datasets</h3><p className="text-3xl font-bold mt-2">{datasets.length}</p></div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4"><a className="link" href="/projects">Manage projects</a></div>
        <div className="card p-4"><a className="link" href="/papers">Manage papers</a></div>
        <div className="card p-4"><a className="link" href="/datasets">Manage datasets</a></div>
      </div>
    </div>
  )
}
