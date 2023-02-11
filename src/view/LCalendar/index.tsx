import React, {
  useEffect,
  useContext, useRef
} from 'react'
import { CreatePopover } from './Popover/CreatePopover'
import { NormalPopover } from './Popover/NormalPopover'
import {
  DEFAULT_MAX_DAYS,
  DEFAULT_WEEK_DAYS
} from './utils/time'
import { IGlobalCache, ITimes } from './props/type'
import { CalendarTimestamp } from './utils/calendar'
import { SideComponent } from './SideComponent'
import {
  nextDay,
  prevDay,
  DAY_MIN,
  relativeDays,
  DAYS_IN_WEEK,
  getEndOfWeek,
  copyTimestamp,
  updateWeekday,
  getStartOfWeek,
  updateRelative,
  timestampToDate,
  updateFormatted,
  DAYS_IN_MONTH_MAX, getStartOfMonth, getEndOfMonth
} from './utils/timesStamp'
import styles from './style.module.less'
import MenuHeader from './modules/MenuHeader'
import {
  BaseContext, CalendarContext, EventContext, IntervalsContext, MouseEventContext
} from './props/propsContext'
import { DayWrapper } from './modules/DayWrapper'
import { MonthWrapper } from './modules/MonthWrapper'

const globalCache:IGlobalCache = {
  currentMousedownRef: null,
  currentMousedownEvent: null,
  currentCreateEvent: null,
  isDragEvent: false,
}



export default function () {
  const { setEnd,
    setStart,
    weekDays,
    setWeekDays,
    times,
    parsedValue, } = useContext(BaseContext)
  const { events, setEvents, } = useContext(EventContext)
  const { type, value, setValue, setType, } = useContext(CalendarContext)
  const {  setMaxDays, } = useContext(IntervalsContext)
  const {  setCreatePopoverRef, setShowCreatePopover,
    setShowNormalPopover, setNormalPopoverRef, setNormalEvent, } = useContext(MouseEventContext)
  function clearPagePopover() {
    setCreatePopoverRef(null)
    setShowCreatePopover(false)
    setShowNormalPopover(false)
    setNormalPopoverRef(null)
    setNormalEvent(null)
  }
  function clearCreateEvent() {
    setEvents(events.filter((e) => !e.isCreate))
    setShowCreatePopover(false)
  }

  // 这里的是为了响应type的变化
  // 目前在周视图和日视图中
  // 修改 maxDays 和 weekDays
  useEffect(() => {
    const around = parsedValue as CalendarTimestamp
    let newMaxDays = DEFAULT_MAX_DAYS
    let newWeekdays = DEFAULT_WEEK_DAYS
    switch (type) {
    case 'month':{
      break
    }
    case 'week':{
      break
    }
    case 'day':{
      newMaxDays = 1
      newWeekdays = [around.weekday]
    }
    }
    setMaxDays(newMaxDays)
    setWeekDays(newWeekdays)
  }, [type, parsedValue])

  // 由于move会改变value
  // 所以move会改变 parsedValue
  // value 会改变当前页面的显示日期
  // 这里还会依赖到 maxDays weekDays
  // 当修改type完成后,根据上面两个值渲染新的页面
  useEffect(() => {
    const around = parsedValue as CalendarTimestamp
    let newStart = around.date
    let newEnd = around.date
    switch (type) {
    case 'month':{
      newStart = getStartOfMonth(around).date
      newEnd = getEndOfMonth(around).date
      break
    }
    case 'week':{
      newStart = getStartOfWeek(
        around, weekDays, around
      ).date
      newEnd = getEndOfWeek(
        around, weekDays, around
      ).date
      break
    }
    case 'day':{
      break
    }
    }
    setStart(newStart)
    setEnd(newEnd)
  }, [parsedValue, weekDays, type])
  // 点击下一天，应该提前更新parsedValue


  function move(amount = 1):void {
    const moved = copyTimestamp(parsedValue as CalendarTimestamp)
    const forward = amount > 0
    const mover = forward ? nextDay : prevDay
    const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN
    let newAmount = forward ? amount : -amount
    while ((newAmount -= 1) >= 0) {
      switch (type) {
      case 'month':{
        moved.day = limit
        mover(moved)
        break
      }
      case 'week':{
        relativeDays(
          moved, mover, DAYS_IN_WEEK
        )
        break
      }
      case 'day':{
        relativeDays(
          moved, mover, 1
        )
        break
      }
      }
    }
    // 根据年月日 计算周几
    updateWeekday(moved)
    // 设置 time 和 date
    updateFormatted(moved)
    updateRelative(moved, (times as ITimes).now)
    if (value instanceof Date) {
      setValue(timestampToDate(moved))
    } else if (typeof value === 'number') {
      setValue(timestampToDate(moved)
        .getTime())
    } else {
      setValue(moved.date)
    }
  }



  const containerMousedown = () => {
    if (!globalCache.currentMousedownRef) {
      clearPagePopover()
      clearCreateEvent()
    }
  }

  const createRef = useRef<Element>(null)

  useEffect(() => {
    if (createRef) {
      setCreatePopoverRef(createRef.current)
    } else {
      setCreatePopoverRef(null)
    }
  }, [createRef.current])


  const setGlobalCacheValue = (key: keyof IGlobalCache, val:any):void => {
    globalCache[key] = val
  }
  return (
    <>
      <CreatePopover />
      <NormalPopover  />
      <div className={styles.mainContainer} onMouseDown={containerMousedown}>
        <div className={styles.mainLeft}>
          <SideComponent />
        </div>
        <div className={styles.mainRight}>
          <MenuHeader
            value={value}
            type={type}
            setToday={setValue}
            setType={setType}
            prev={(amount) => move(amount)}
            next={(amount) => move(amount)} />
          {
            type === 'month' ?
              <MonthWrapper
              /> :
              <DayWrapper
                clearCreateEvent={clearCreateEvent}
                globalCache={globalCache}
                setGlobalCacheValue={setGlobalCacheValue}
                ref={createRef}
              />
          }
        </div>
      </div>
    </>

  )
}
