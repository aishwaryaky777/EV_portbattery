import { Reservation, Station, StationBay } from '../types';
import { INITIAL_STATIONS } from '../data/sampleStations';

const STATIONS_KEY = 'voltshare_stations_v1';
const RESERVATIONS_KEY = 'voltshare_reservations_v1';
const ACTIVE_RESERVATION_ID_KEY = 'voltshare_active_res_id_v1';

export const storageService = {
  // Get all stations with fallback to INITIAL_STATIONS
  getStations(): Station[] {
    try {
      const data = localStorage.getItem(STATIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse stations from localStorage', e);
    }
    // Initialize default stations
    localStorage.setItem(STATIONS_KEY, JSON.stringify(INITIAL_STATIONS));
    return INITIAL_STATIONS;
  },

  // Save updated stations
  saveStations(stations: Station[]): void {
    try {
      localStorage.setItem(STATIONS_KEY, JSON.stringify(stations));
    } catch (e) {
      console.error('Failed to save stations', e);
    }
  },

  // Update specific bay status in a station
  updateBayStatus(stationId: string, bayId: string, newStatus: StationBay['status'], overrides?: Partial<StationBay>): void {
    const stations = this.getStations();
    const station = stations.find(s => s.id === stationId);
    if (!station) return;

    const bay = station.bays.find(b => b.bayId === bayId);
    if (!bay) return;

    bay.status = newStatus;
    bay.lastUpdated = 'Just now';
    if (overrides) {
      Object.assign(bay, overrides);
    }

    this.saveStations(stations);
  },

  // Get all reservations
  getReservations(): Reservation[] {
    try {
      const data = localStorage.getItem(RESERVATIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse reservations', e);
    }
    return [];
  },

  // Get single active reservation if any
  getActiveReservation(): Reservation | null {
    const reservations = this.getReservations();
    const activeId = localStorage.getItem(ACTIVE_RESERVATION_ID_KEY);
    if (!activeId) {
      // Find latest non-returned/non-cancelled
      const active = reservations.find(r => r.status === 'Reserved' || r.status === 'Ready for Collection' || r.status === 'In Use');
      return active || null;
    }
    return reservations.find(r => r.id === activeId && r.status !== 'Returned' && r.status !== 'Cancelled') || null;
  },

  // Create a new reservation
  saveReservation(reservation: Reservation): void {
    const reservations = this.getReservations();
    reservations.unshift(reservation);
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
    localStorage.setItem(ACTIVE_RESERVATION_ID_KEY, reservation.id);

    // Update station bay status to 'Reserved'
    this.updateBayStatus(reservation.station.id, reservation.assignedBayId, 'Reserved');
  },

  // Update reservation status (e.g. In Use, Ready, Returned, Cancelled)
  updateReservationStatus(reservationId: string, status: Reservation['status'], extra?: Partial<Reservation>): void {
    const reservations = this.getReservations();
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    res.status = status;
    if (extra) {
      Object.assign(res, extra);
    }
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));

    // If cancelled, free up the bay
    if (status === 'Cancelled') {
      this.updateBayStatus(res.station.id, res.assignedBayId, 'Available');
      if (localStorage.getItem(ACTIVE_RESERVATION_ID_KEY) === reservationId) {
        localStorage.removeItem(ACTIVE_RESERVATION_ID_KEY);
      }
    } else if (status === 'Returned') {
      // Free up bay or mark bay as under inspection
      this.updateBayStatus(res.station.id, res.assignedBayId, 'Under Inspection');
      if (localStorage.getItem(ACTIVE_RESERVATION_ID_KEY) === reservationId) {
        localStorage.removeItem(ACTIVE_RESERVATION_ID_KEY);
      }
    } else if (status === 'In Use') {
      this.updateBayStatus(res.station.id, res.assignedBayId, 'In Use');
    }
  },

  // Reset to initial state
  resetAllData(): void {
    localStorage.removeItem(STATIONS_KEY);
    localStorage.removeItem(RESERVATIONS_KEY);
    localStorage.removeItem(ACTIVE_RESERVATION_ID_KEY);
  }
};
