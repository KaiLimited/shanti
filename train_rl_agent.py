# train_rl_agent.py
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam
from qmc_environment import QuantumMonteCarloEnvironment

def build_rl_model(input_size, output_size):
    """
    Builds a neural network model for reinforcement learning.

    Args:
        input_size (int): Size of the input layer.
        output_size (int): Size of the output layer.

    Returns:
        tensorflow.keras.models.Sequential: Reinforcement learning model.
    """
    model = Sequential()
    model.add(Dense(24, input_dim=input_size, activation='relu'))
    model.add(Dense(24, activation='relu'))
    model.add(Dense(output_size, activation='linear'))
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
    return model

def safety_checks(state, threshold):
    """
    Performs safety checks based on domain-specific considerations.

    Args:
        state (np.ndarray): Current state of the material.
        threshold (int): Safety threshold.

    Returns:
        bool: True if safety threshold is exceeded, False otherwise.
    """
    if np.sum(state) > threshold:
        return True
    return False

def train_rl_agent(model, environment, num_episodes):
    """
    Trains the reinforcement learning agent.

    Args:
        model (tensorflow.keras.models.Sequential): Reinforcement learning model.
        environment (QuantumMonteCarloEnvironment): Reinforcement learning environment.
        num_episodes (int): Number of episodes for training.
    """
    for episode in range(num_episodes):
        state = environment.reset()
        state = np.reshape(state, [1, environment.state_size])

        for step in range(environment.max_steps_per_episode):
            action = np.argmax(model.predict(state))

            next_state, reward, done = environment.step(action)
            next_state = np.reshape(next_state, [1, environment.state_size])

            if safety_checks(next_state, environment.safety_threshold):
                print("Safety Threshold Exceeded. Terminating Episode.")
                break

            target = reward + 0.99 * np.max(model.predict(next_state))
            target_f = model.predict(state)
            target_f[0][action] = target

            model.fit(state, target_f, epochs=1, verbose=0)

            state = next_state

            if done or step == environment.max_steps_per_episode - 1:
                print(f"Episode {episode + 1} - Steps: {step + 1}")
                break

if __name__ == "__main__":
    qmc_env = QuantumMonteCarloEnvironment()
    rl_model = build_rl_model(qmc_env.state_size, qmc_env.action_size)
    train_rl_agent(rl_model, qmc_env, num_episodes=1000)
