import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material';

import App from './App';
import AppStateProvider, { useAppState } from '../../../../components/twilioutils/state';
import { useRouter } from 'next/router';
import ErrorDialog from '../../../../components/ErrorDialog/ErrorDialog';
import LoginPage from '../../../../components/LoginPage/LoginPage';
import PrivateRoute from '../../../../components/PrivateRoute/PrivateRoute';
import theme from '../../../../components/twilioutils/theme';
import '../../../../components/twilioutils/types';
import { ChatProvider } from '../../../../components/ChatProvider';
import { ParticipantProvider } from '../../../../components/ParticipantProvider';
import { VideoProvider } from '../../../../components/VideoProvider';
import useConnectionOptions from '../../../../components/twilioutils/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '../../../../components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

const VideoApp = () => {
	const { error, setError } = useAppState();
	const connectionOptions = useConnectionOptions();

	return (
		<VideoProvider options={connectionOptions} onError={setError}>
			<ErrorDialog dismissError={() => setError(null)} error={error} />
			<ParticipantProvider>
				<ChatProvider>
					<App />
				</ChatProvider>
			</ParticipantProvider>
		</VideoProvider>
	);
};

const Index = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<UnsupportedBrowserWarning>
				<AppStateProvider>
					<VideoApp />
				</AppStateProvider>
				{/* <Router>
					<AppStateProvider>
						<Switch>
							<PrivateRoute exact path="/">
								<VideoApp />
							</PrivateRoute>
							<PrivateRoute path="/room/:URLRoomName">
								<VideoApp />
							</PrivateRoute>
							<Route path="/login">
								<LoginPage />
							</Route>
							<Redirect to="/" />
						</Switch>
					</AppStateProvider>
				</Router> */}
			</UnsupportedBrowserWarning>
		</ThemeProvider>
	)
}

export default Index