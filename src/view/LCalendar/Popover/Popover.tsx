import styles from './style.module.less'
import React, {
  useCallback,
  useContext, useEffect, useState
} from 'react'
import { BaseContext } from '../props/propsContext'
import { IS_EVENT } from '../components/type'
export function Popover(props: React.PropsWithChildren<{ container:React.RefObject<HTMLElement> }>) {
  const { container, } = props
  const [left, setLeft] = useState(100)
  const [top, setTop] = useState(100)
  const { setRef, selectedRef, moving, setMoving, createEvent, } = useContext(BaseContext)

  // 在某个元素上mousedown 但是在别的元素上mouseup  造成popover不显示的问题 或则显示错误的问题
  // 解决以上上的的办法就是设置一个变量，来判断是点击还是位移
  // 是做时间调整的操作 也会产生显示popover
  //
  const onMousedown = useCallback((e:MouseEvent) => {
    if (!(e.currentTarget as Element).classList.contains(IS_EVENT)) {
      setRef(null)
      setMoving(false)
    }
  }, [createEvent])

  useEffect(() => {
    if (selectedRef) {
      const { left, top, } = selectedRef.getBoundingClientRect()
      setLeft(left - 200)
      setTop(top)
    }
  }, [selectedRef, moving])

  useEffect(() => {
    if (container && container.current) {
      container.current.addEventListener('mousedown', onMousedown)
    }
  }, [container])

  return (
    <>
      {
        selectedRef ?
          <div
            style={{
              top: `${top}px`,
              left: `${left}px`,
            }}
            className={styles.popoverContainer}>
            Popover</div> :
          ''
      }
    </>
  )
}
