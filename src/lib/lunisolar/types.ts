import type { Lunisolar } from './class/lunisolar'

export type CommonDict = {
  [key: string]: any
}

export type MarkerFormatFn = (lsr: Lunisolar) => string | null

export type MarkersSettingItem = {
  name: string
  tag?: string | string[]
  data?: {
    [key: string]: any
  }
}

export type MarkersSetting = {
  format: string | MarkerFormatFn
  markers: {
    [key: string]: MarkersSettingItem | MarkersSettingItem[]
  }
}[]

export type StoreMarker = Pick<MarkersSettingItem, 'name' | 'data'> & { tag: string[] }
export type MarkersMatcherMap = Map<string, StoreMarker[]>

export type MarkersFnListItem = { fn: MarkerFormatFn; markers: MarkersMatcherMap }

export type MarkersStore = {
  formatList: string[]
  formatMap: Map<string, MarkersMatcherMap>
  fnList: MarkersFnListItem[]
}

export type MarkersFilterFn = (item: StoreMarker, index?: number, arr?: StoreMarker[]) => boolean
