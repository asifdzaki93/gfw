import { getUSLandCover } from 'services/forest-data';

// export default () => new Promise(resolve => resolve(getUSLandCover()));

export default ({ params }) =>
  getUSLandCover({ ...params }).then(response => {
    const data = response.data.rows;
    return data;
  });
