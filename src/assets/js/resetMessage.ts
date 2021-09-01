import {
  Message
} from 'element-ui'
const showMessage = Symbol('showMessage')
// @ts-ignore
let messageInstance = null
class DoneMessage {
  // @ts-ignore
  [showMessage] (type, options, single) {
    // @ts-ignore
    if (messageInstance && single) {
      // @ts-ignore
      messageInstance.close()
    }
    // @ts-ignore
    messageInstance = Message[type](options)
  }
  // @ts-ignore
  info (options, single = true) {
    this[showMessage]('info', options, single)
  }
  // @ts-ignore
  warning (options, single = true) {
    this[showMessage]('warning', options, single)
  }
  // @ts-ignore
  error (options, single = true) {
    this[showMessage]('error', options, single)
  }
  // @ts-ignore
  success (options, single = true) {
    this[showMessage]('success', options, single)
  }
}
export const resetMessage = new DoneMessage()
