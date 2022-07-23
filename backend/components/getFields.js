const {parseResolveInfo} = require("graphql-parse-resolve-info");

module.exports = (resolveInfo, type) => {
    const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
    let fieldsToSelect = "";
    for (const field in parsedResolveInfoFragment.fieldsByTypeName[type])
        fieldsToSelect += `${field} `
    return fieldsToSelect;
}