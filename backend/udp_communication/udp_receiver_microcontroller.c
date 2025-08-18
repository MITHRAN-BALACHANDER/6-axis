#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

// This is a conceptual example for a microcontroller.
// Actual implementation will depend on the specific microcontroller,
// its network stack (e.g., LwIP, FreeRTOS+TCP), and JSON parsing library.

#define UDP_PORT 12345
#define MAX_BUFFER_SIZE 1024

// Function to parse JSON (conceptual)
// In a real scenario, you'd use a lightweight JSON parser library
// like JSMN, cJSON, or similar, adapted for embedded systems.
void parse_json_data(const char *json_string) {
    // This is a placeholder. A real implementation would parse the JSON
    // and extract joint values.
    printf("Parsing JSON: %s\n", json_string);
    // Example: Look for "joint1", "joint2", etc.
    // For a simple approach, you might use strstr and sscanf,
    // but a proper JSON parser is recommended for robustness.
}

int main() {
    int sockfd;
    struct sockaddr_in server_addr, client_addr;
    char buffer[MAX_BUFFER_SIZE];
    socklen_t addr_len = sizeof(client_addr);

    // 1. Create UDP socket
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("Error creating socket");
        return 1;
    }

    // 2. Configure server address
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY); // Listen on all available interfaces
    server_addr.sin_port = htons(UDP_PORT);

    // 3. Bind socket to address and port
    if (bind(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("Error binding socket");
        close(sockfd);
        return 1;
    }

    printf("Microcontroller UDP Receiver listening on port %d...\n", UDP_PORT);

    while (1) {
        // 4. Receive data
        ssize_t bytes_received = recvfrom(sockfd, buffer, MAX_BUFFER_SIZE - 1, 0,
                                          (struct sockaddr *)&client_addr, &addr_len);
        if (bytes_received < 0) {
            perror("Error receiving data");
            continue;
        }

        buffer[bytes_received] = '\0'; // Null-terminate the received data

        printf("Received %zd bytes from %s:%d\n", bytes_received,
               inet_ntoa(client_addr.sin_addr), ntohs(client_addr.sin_port));

        // 5. Process received JSON data
        parse_json_data(buffer);
    }

    // 6. Close socket (unreachable in this infinite loop, but good practice)
    close(sockfd);

    return 0;
}
