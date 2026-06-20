import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { NiveauSelect } from '@/components/ui/NiveauSelect'
import { useGetFilieresQuery } from '@/features/catalog/api/catalogApi'
import { useBroadcastNotificationMutation } from '@/features/notifications/api/notificationsApi'
import {
  PORTEE_NOTIFICATION_LABELS,
  type PorteeNotification,
} from '@/types/notifications'

const PORTEE_OPTIONS: PorteeNotification[] = [
  'FILIERE',
  'NIVEAU',
  'FILIERE_ET_NIVEAU',
]

export function TrainingNotificationsPage() {
  const { data: filieres = [] } = useGetFilieresQuery()
  const [broadcast, { isLoading }] = useBroadcastNotificationMutation()

  const [titre, setTitre] = useState('')
  const [message, setMessage] = useState('')
  const [portee, setPortee] = useState<PorteeNotification>('FILIERE_ET_NIVEAU')
  const [filiereId, setFiliereId] = useState<number | ''>('')
  const [niveau, setNiveau] = useState('')
  const [lien, setLien] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const needsFiliere = portee === 'FILIERE' || portee === 'FILIERE_ET_NIVEAU'
  const needsNiveau = portee === 'NIVEAU' || portee === 'FILIERE_ET_NIVEAU'

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFeedback(null)
    setError(null)

    try {
      const result = await broadcast({
        titre,
        message,
        portee,
        filiereId: needsFiliere && filiereId !== '' ? Number(filiereId) : undefined,
        niveau: needsNiveau ? niveau : undefined,
        lien: lien.trim() || undefined,
      }).unwrap()

      setFeedback(
        `Notification envoyée à ${result.notifiedCount} étudiant${result.notifiedCount > 1 ? 's' : ''}.`,
      )
      setTitre('')
      setMessage('')
      setLien('')
    } catch {
      setError("Impossible d'envoyer la notification. Vérifiez le périmètre sélectionné.")
    }
  }

  return (
    <div>
      <PageHeader
        title="Notifications étudiants"
        description="Diffusez une annonce ciblée par filière, niveau, ou les deux"
      />

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle annonce</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Titre</label>
              <Input
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex. Report de cours"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
              <textarea
                className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Contenu de la notification..."
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Périmètre de diffusion
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={portee}
                onChange={(e) => setPortee(e.target.value as PorteeNotification)}
              >
                {PORTEE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {PORTEE_NOTIFICATION_LABELS[option]}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Filière seule : tous les étudiants de la filière. Niveau seul : tous les étudiants
                du niveau. Les deux : intersection filière + niveau.
              </p>
            </div>

            {needsFiliere && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Filière</label>
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={filiereId}
                  onChange={(e) =>
                    setFiliereId(e.target.value ? Number(e.target.value) : '')
                  }
                  required
                >
                  <option value="">Choisir une filière</option>
                  {filieres.map((filiere) => (
                    <option key={filiere.id} value={filiere.id}>
                      {filiere.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {needsNiveau && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Niveau</label>
                <NiveauSelect value={niveau} onChange={setNiveau} required />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Lien interne (optionnel)
              </label>
              <Input
                value={lien}
                onChange={(e) => setLien(e.target.value)}
                placeholder="/student/formations"
              />
            </div>

            {feedback && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {feedback}
              </p>
            )}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Envoi…' : 'Publier la notification'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
