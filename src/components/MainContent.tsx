import type { ProductionStep } from '../types'
import ProjectManagement from './modules/ProjectManagement'
import EngineeringManagement from './modules/EngineeringManagement'
import ProcurementMRP from './modules/ProcurementMRP'
import MaterialTracking from './modules/MaterialTracking'
import ProductionControl from './modules/ProductionControl'
import WeldingManagement from './modules/WeldingManagement'
import PaintingManagement from './modules/PaintingManagement'
import OutfittingManagement from './modules/OutfittingManagement'
import QAQCManagement from './modules/QAQCManagement'
import SurveyorAIEngine from './modules/SurveyorAIEngine'
import NDTManagement from './modules/NDTManagement'
import DocumentManagement from './modules/DocumentManagement'
import LaunchingManagement from './modules/LaunchingManagement'
import SeaTrialManagement from './modules/SeaTrialManagement'
import CEODashboard from './modules/CEODashboard'
import AIMaritimeExpert from './modules/AIMaritimeExpert'

interface MainContentProps {
  activeModule: string
  productionSteps: ProductionStep[]
}

export default function MainContent({ activeModule, productionSteps }: MainContentProps) {
  const renderModule = () => {
    switch (activeModule) {
      case 'project-management':
        return <ProjectManagement />
      case 'engineering-management':
        return <EngineeringManagement />
      case 'procurement':
        return <ProcurementMRP />
      case 'material-tracking':
        return <MaterialTracking />
      case 'production-control':
        return <ProductionControl steps={productionSteps} />
      case 'welding':
        return <WeldingManagement />
      case 'painting':
        return <PaintingManagement />
      case 'outfitting':
        return <OutfittingManagement />
      case 'qa-qc':
        return <QAQCManagement />
      case 'surveyor-ai':
        return <SurveyorAIEngine />
      case 'ndt':
        return <NDTManagement />
      case 'document-mgmt':
        return <DocumentManagement />
      case 'launching':
        return <LaunchingManagement />
      case 'sea-trial':
        return <SeaTrialManagement />
      case 'ceo-dashboard':
        return <CEODashboard />
      case 'ai-maritime':
        return <AIMaritimeExpert />
      default:
        return <ProjectManagement />
    }
  }

  return (
    <div className="w-full h-full overflow-auto bg-slate-50">
      <div className="p-6">
        {renderModule()}
      </div>
    </div>
  )
}
