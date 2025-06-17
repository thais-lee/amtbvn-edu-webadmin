import httpService from '@/shared/http-service';

import { StatsDto } from './dto/stats.dto';

class DashboardService {
  getStats() {
    return httpService.request<StatsDto>({
      method: 'GET',
      url: '/api/dashboard/stats',
    });
  }
}

export default new DashboardService();
