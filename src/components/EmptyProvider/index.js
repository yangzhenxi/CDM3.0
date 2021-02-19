import { State as EmptyStateItem, Text as EmptyTextItem } from './Item'
import EmptyProvider from './EmptyProvider'

const createEmptyProvider = function (provider, options = {}) {
  return {
    ...provider,
    ...options
  }
}

export {
  EmptyStateItem,
  EmptyTextItem,
  EmptyProvider,
  createEmptyProvider
}
