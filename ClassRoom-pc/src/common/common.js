export const LanguageTypes = [
    {'id': 'zh_CN', 'name': '简体中文'},
    {'id': 'en_US', 'name': 'English(United States)'}
];

export const RoomTypes = [
    {'id': '1', 'name': '大班课'}
];

export const RoleTypes = [
    {'id': '1', 'name': '教师'},
    {'id': '1', 'name': '学生'}
];

export function getText(state, type) {
    if (type === 'RoleTypes') {
        return [{'id': '1', 'name': state.lang.Nickname}];
    } else if (type === 'RoomTypes') {
        return [{'id': '1', 'name': state.lang.ClassType}];
    }
}