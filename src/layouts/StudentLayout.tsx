import { StudentProvider } from '@/features/student/context/StudentProvider'
import { StudentShell } from '@/components/layout/StudentShell'
import { STUDENT_NAV } from '@/routes/config/navConfig'

export function StudentLayout() {
  return (
    <StudentProvider
      sectionTitle="Étudiant"
      sectionSubtitle="Mon espace personnel"
      navItems={STUDENT_NAV}
    >
      <StudentShell navItems={STUDENT_NAV} />
    </StudentProvider>
  )
}
