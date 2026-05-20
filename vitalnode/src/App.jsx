import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DoctorsProvider } from './context/DoctorsContext';
import { AppointmentsProvider } from './context/AppointmentsContext';
import { SocketProvider } from './context/SocketContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <DoctorsProvider>
            <AppointmentsProvider>
              <SocketProvider>
                <AppRoutes />
              </SocketProvider>
            </AppointmentsProvider>
          </DoctorsProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
