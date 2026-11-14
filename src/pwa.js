import {registerSW} from 'virtual:pwa-register'

if (import.meta.env.PROD) {
  const updateSW = registerSW({
    immediate: true,

    onNeedRefresh() {
      const accepted = window.confirm(
        'A new version of the church app is ready. ' +
        'Refresh now? Choose Cancel to keep reading.',
      )

      if (accepted) {
        updateSW(true).catch((error) => {
          console.error('Unable to update the app:', error)
        })
      }
    },

    onOfflineReady() {
      // This confirms app files are cached, not Sanity content.
      console.info('Church app files are available offline.')
    },

    onRegisterError(error) {
      console.error('Unable to register offline support:', error)
    },
  })
}