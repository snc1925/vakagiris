interface DataEntry {
  date: string;
  institution: string;
  doctor: string;
  patientName: string;
  status: 'Private' | 'Billed';
  deviceNumber: string;
  technician: string;
  notes: string;
}

export class GoogleSheetsService {
  private static readonly SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzF2ONV2l5hQhKVkVUWoFl3igX8GngGFiKr14p8AwoKlWO2UMN8_iFdUaB6ubZxIkBhQ/exe';
  
  static async submitEntry(entry: DataEntry): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('date', entry.date);
      formData.append('institution', entry.institution);
      formData.append('doctor', entry.doctor);
      formData.append('patientName', entry.patientName);
      formData.append('status', entry.status);
      formData.append('deviceNumber', entry.deviceNumber);
      formData.append('technician', entry.technician);
      formData.append('notes', entry.notes);

      const response = await fetch(this.SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // Required for Google Apps Script
      });

      // Since we're using no-cors mode, we can't check response status
      // We'll assume success if no error is thrown
      return true;
    } catch (error) {
      console.error('Google Sheets submission error:', error);
      return false;
    }
  }
}
