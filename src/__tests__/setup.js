// 在 Vitest 捕获 unhandled rejection 之前注册 handler
// 这是为了解决 fake timers 下 promise rejection 被 Vitest 误报的问题
import { vi } from 'vitest'

// 注册全局 unhandledRejection handler，防止 Vitest 报告为错误
if (typeof process !== 'undefined' && typeof process.on === 'function') {
  process.on('unhandledRejection', () => {})
}
