import {
  BaseContext,
  EventContext,
  WeeksContext,
  DEFAULT_WEEKS,
  DEFAULT_EVENT,
  CalendarContext,
  DEFAULT_INTERVALS,
  IntervalsContext,
  MouseEventContext
} from './propsContext'
import React,
{
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  DEFAULT_TYPE,
  DEFAULT_VALUE,
  DEFAULT_MAX_DAYS,
  DEFAULT_WEEK_DAYS
} from '../utils/time'
import {
  createDayList,
  parseTimeStamp,
  getWeekdaySkips,
  validateTimestamp,
  getTimestampIdentifier
} from '../utils/timesStamp'
import {
  IValue,
  CalendarEvent,
  CalendarTimestamp,
  CalendarEventParsed,
  CalendarEventOverlapMode
} from '../utils/calendar'
import { ITimes } from './type'
import {  parseEvent } from '../utils/events'
import { CalendarEventOverlapModes } from '../utils/modes'
import { getEventList } from '../../../api/event'



export function VisualContext(props:React.ProviderProps<any>):React.ReactElement {
  // Popover相关
  //

  /**
   * todo
   * 这里和createPopover有关的变量
   * */
  const [createPopoverRef, setCreatePopoverRef] = useState<Element | null>(null)
  const [showCreatePopover, setShowCreatePopover] = useState<boolean>(true)
  const [normalEvent, setNormalEvent] = useState<CalendarEvent|null>(null)




  /***
   * todo
   * 这里是普通的popover相关的变量
   * 这里没有去存储event
   * 因为可以使用memo来筛选出 createEvent
   */
  const [normalPopoverRef, setNormalPopoverRef] = useState<Element | null>(null)
  const [showNormalPopover, setShowNormalPopover] = useState<boolean>(false)



  /**
   * todo
   * 这里是和popover位置相关的
   */
  const [dayScrollRef, setDayScrollRef] = useState<Element | null>(null)











  const children = props.children
  const [now] = useState(Date.now())
  const [weekDays, setWeekDays] = useState<number[]>(DEFAULT_WEEK_DAYS)
  const [start, setStart] = useState<string>(parseTimeStamp(Date.now(), true)?.date as string)
  const [end, setEnd] = useState<string>(parseTimeStamp(Date.now(), true)?.date as string)
  const times = useMemo<ITimes>(() => ({
    now: parseTimeStamp(now, true),
    today: parseTimeStamp(now, true),
  }), [now])


  const [type, setType] = useState<string>(DEFAULT_TYPE)
  const [value, setValue] = useState<IValue>(DEFAULT_VALUE)

  const [maxDays, setMaxDays] = useState<number>(DEFAULT_MAX_DAYS)
  const [intervalHeight] = useState<number>(DEFAULT_INTERVALS.intervalHeight)
  const [intervalWidth] = useState<number>(DEFAULT_INTERVALS.intervalWidth)
  const [firstInterval] = useState<number>(DEFAULT_INTERVALS.firstInterval)
  const [intervalCount] = useState<number>(DEFAULT_INTERVALS.intervalCount)
  const [intervalMinutes] = useState<number>(DEFAULT_INTERVALS.intervalMinutes)



  const parsedStart = useMemo<CalendarTimestamp>(() => parseTimeStamp(start, true), [start])
  const parsedEnd = useMemo(() => {
    const newEnd = end ? parseTimeStamp(end, true) : parsedStart
    return getTimestampIdentifier(newEnd) < getTimestampIdentifier(parsedStart) ? parsedStart : newEnd
  }, [parsedStart, end])
  const parsedWeekdays = useMemo(() => weekDays, [weekDays])
  const parsedValue = useMemo<CalendarTimestamp>(() =>  (validateTimestamp(value) ?
    parseTimeStamp(value, true) :
    (parsedStart || times.today)), [value])
  const weekdaySkips = useMemo<number[]>(() => getWeekdaySkips(parsedWeekdays), [parsedWeekdays])


  const days = useMemo<CalendarTimestamp[]>(() => {
    const ds = createDayList(
      parsedStart, parsedEnd, times.today, weekdaySkips
    )
    return ds
  },
  [parsedStart, parsedEnd, times, weekdaySkips])




  const [minWeeks] = useState<number>(DEFAULT_WEEKS.minWeeks)


  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [eventStart] = useState(DEFAULT_EVENT.eventStart)
  const [eventEnd] = useState(DEFAULT_EVENT.eventEnd)
  const [eventTimed] = useState(DEFAULT_EVENT.eventTimed)
  const [eventOverlapMode] = useState(DEFAULT_EVENT.eventOverlapMode)
  const [eventOverlapThreshold] = useState(DEFAULT_EVENT.eventOverlapThreshold)
  const [eventHeight] = useState(DEFAULT_EVENT.eventHeight)
  const [eventMarginBottom] = useState(DEFAULT_EVENT.eventMarginBottom)

  useEffect(() => {
    (async () => {
      const { data, } = await getEventList({
        start: Date.now(),
        end: Date.now(),
      })
      setEvents(data.list)
    })()
  }, [value])



  /**
   * todo
   * 更改events
   *
   * 找到oldEvent位置，使用newEvent替换旧的
   * 未找到oldEvent，直接添加newEvent
   *
   * @param oldEvent
   * @param newEvent
   */
  const resetEvents = (oldEvent:CalendarEvent|null, newEvent:CalendarEvent | null):void => {
    const index = events.findIndex((e) => e === oldEvent)
    if (index > -1) {
      events.splice(
        index, 1, newEvent as CalendarEvent
      )
    } else {
      events.push(newEvent as CalendarEvent)
    }
    const newEvents = events.filter((i) => !!i)
    setEvents([...newEvents])
  }
  const parsedEvents = useMemo<CalendarEventParsed[]>(() => events.map((input, index) => parseEvent(
    input,
    index,
    eventStart,
    eventEnd,
    (!!input[eventTimed])
  )), [events, eventStart, eventEnd])
  const eventModeFunction = useMemo<CalendarEventOverlapMode>(() => CalendarEventOverlapModes[eventOverlapMode], [eventOverlapMode])




  return (
    <BaseContext.Provider value={{
      start,
      setStart,
      end,
      setEnd,
      weekDays,
      setWeekDays,
      times,
      parsedStart,
      parsedEnd,
      parsedWeekdays,
      parsedValue,
      weekdaySkips,
      days,
    }}>
      <CalendarContext.Provider value={{
        type,
        setType,
        value,
        setValue,
      }}>
        <IntervalsContext.Provider value={{
          maxDays,
          setMaxDays,
          intervalHeight,
          intervalWidth,
          firstInterval,
          intervalCount,
          intervalMinutes,
        }}>
          <WeeksContext.Provider value={{
            minWeeks,
          }}>
            <EventContext.Provider value={{
              events,
              setEvents,
              eventStart,
              eventEnd,
              eventTimed,
              eventOverlapMode,
              eventOverlapThreshold,
              eventHeight,
              eventMarginBottom,
              parsedEvents,
              eventModeFunction,
              resetEvents,
            }}>
              <MouseEventContext.Provider value={{

                createPopoverRef,
                setCreatePopoverRef,
                showCreatePopover,
                setShowCreatePopover,


                normalPopoverRef,
                setNormalPopoverRef,
                showNormalPopover,
                setShowNormalPopover,
                normalEvent,
                setNormalEvent,


                dayScrollRef,
                setDayScrollRef,

              }}>

                {children}
              </MouseEventContext.Provider>
            </EventContext.Provider>
          </WeeksContext.Provider>
        </IntervalsContext.Provider>
      </CalendarContext.Provider>
    </BaseContext.Provider>
  )
}
