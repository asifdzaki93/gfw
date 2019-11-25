import { fetchGladAlerts, fetchGLADLatest } from 'services/glad';
import axios from 'axios';

export default ({ params }) =>
  axios.all([fetchGladAlerts(params), fetchGLADLatest(params)]).then(
    axios.spread((alerts, latest) => {
      let data = {};
      if (alerts && latest) {
        const latestDate =
          latest && latest.attributes && latest.attributes.updatedAt;

        data = {
          alerts,
          latest: latestDate,
          settings: { latestDate }
        };
      }

      return data;
    })
  );
