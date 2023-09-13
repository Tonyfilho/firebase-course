

/**This functions will convert the Any SNAP any DATA to typeSafe */
/**This a TECHNIQUE to TypeSafe to convert any TYPE to Array Type */

export function convertSnap<T>(result) {
    return <T[]> result.docs.map(snap => {
        return {
            id: snap.id,
            ...<any>snap.data()
        }
    })
}