export const groups = (data = {}, groupIds = []) =>
  (data?.data?.boards || [])
    .flatMap(({ groups }) => groups)
    .filter(({ id }) => (groupIds.length ? groupIds.includes(id) : true));

export const filterData = (data = {}, groupIds = []) =>
  groups(data, groupIds).map(({ title, items }) => ({
    name: title,
    value: items.length,
  }));

export const colors = (data = {}, groupIds = []) =>
  groups(data, groupIds).flatMap(({ color }) => color);
