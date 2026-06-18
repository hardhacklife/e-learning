import { MOCK_FORMATIONS } from '@/mocks/data/formations'
import { fakeDelay } from '@/mocks/utils'

export async function handleFormationsList() {
  await fakeDelay()
  return { data: MOCK_FORMATIONS }
}
