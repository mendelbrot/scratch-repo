import {
  Workspace,
  WorkspaceMembership,
  Notebook,
} from '@prisma/client'

export type WorkspaceExtended = Workspace & {
  notebooks: Notebook[]
  workspace_memberships: WorkspaceMembership[]
}
