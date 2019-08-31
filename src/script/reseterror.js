export default function resetErrorMessages(parentNode) {
    const errorsCollection = Array.from(parentNode.getElementsByTagName('span'));
    errorsCollection.forEach(function (item) {
        let idToCheck = item.id;
        if (idToCheck.includes('error')) { item.textContent = ''; }
    });
}