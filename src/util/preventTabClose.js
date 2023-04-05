export const preventTabClose = (_, enabled) => {
    const handler = (e) => {
        e.preventDefault();
        e.returnValue = '';
    }, setHandler = (shouldWork) => shouldWork ?
        window.addEventListener('beforeunload', handler) :
        window.removeEventListener('beforeunload', handler);
    setHandler(enabled);
    return {
        update: setHandler,
        destroy: () => setHandler(false),
    };
};
