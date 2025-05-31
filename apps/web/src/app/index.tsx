import { RuntimeProvider } from "@/components/RuntimeProvider";
import { AssistantUI } from "@/components/assistant-ui";
import "./styles.css";

function App() {
	return (
		<RuntimeProvider>
			<div className="container">
				<AssistantUI />
				{/* <CopilotKitComponent /> */}
			</div>
		</RuntimeProvider>
	);
}

export default App;
