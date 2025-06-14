import AiFiagnosticFileUpload from '@/components/ai-diagnostic-component/ai-diagnostic-file-upload'
import MainLayout from '@/layout-component/main-layout'
import React from 'react'

const AiDiagnosticPage = () => {
  return (
    <>
      <MainLayout>
        <AiFiagnosticFileUpload />
      </MainLayout>
    </>
  )
}

export default AiDiagnosticPage
