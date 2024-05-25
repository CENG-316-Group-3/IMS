#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

void addElement(char arr[10][100], int *counter, char element[]) {
    if (*counter < 10) {
        // Add element to array if there is space
        strcpy(arr[*counter], element);
        (*counter)++;
    } else {
        // Remove the first element and shift others
        for (int i = 0; i < 10 - 1; i++) {
            strcpy(arr[i], arr[i + 1]);
        }
        strcpy(arr[9], element);
    }
}

void printArray(char arr[10][100], int counter) {
    int temp = counter;
    if (counter >= 10) {
        temp = 10;
    }
    printf("Array: \n");
    for (int i = 0; i < temp; i++) {
        printf("%s\n", arr[i]);
    }
    printf("\n");
}

int isTrue(char *args[]) {
    for (int i = 0; i < 11 && args[i] != NULL; i++) {
        if ((strcmp(args[i], "&") == 0) && args[i + 1] == NULL) {
            args[i] = NULL;
            return 1;
        }
    }
    return 0;
}

int pipeCheck(char *args[]) {
    for (int i = 0; i < 12; i++) {
        if (args[i] != NULL && strcmp(args[i], "|") == 0) {
            return i; // Return the index of the pipe symbol
        }
    }
    return -1; // Return -1 if no pipe found
}

int doubleAndEndCheck(char *args[]) {
    for (int i = 0; i < 12; i++) {
        if (args[i] != NULL && strcmp(args[i], "&&") == 0) {
            return i; // Return the index of the pipe symbol
        }
    }
    return -1; // Return -1 if no pipe found
}



int main() {
    char history[10][100];
    char input[100];
    char *command;
    char output[100];
    int counter = 0;
    pid_t doublePid ;
    pid_t doublePid2;
    char *args[12] ;

    while (1) {
        printf("myshell> ");
        fgets(input, 100, stdin);
        input[strcspn(input, "\n")] = 0;

        // Tokenize input
        command = strtok(input, " ");

        
        if (args == NULL) {
            perror("malloc");
            exit(EXIT_FAILURE);
        }

        for (int i = 0; i < 12; i++) {
            args[i] = NULL;
        }

        int arg_count = 1;
        args[0] = command;

        while ((args[arg_count] = strtok(NULL, " ")) != NULL) {
            arg_count++;
        }

        if (isTrue(args)) {
            pid_t pidBack = fork();

            if (pidBack > 0) {
                continue;
            } else if (pidBack == 0) {
                printf("%d \n", getpid());
            }
        }
        int doubleEndIndex = doubleAndEndCheck(args);
        int pipeIndex = pipeCheck(args);
        if (pipeIndex >= 0) {
            addElement(history, &counter, input);

            // Create a pipe
            int pipefd[2];
            if (pipe(pipefd) == -1) {
                perror("pipe");
                exit(EXIT_FAILURE);
            }

            pid_t pid = fork();

            if (pid == -1) {
                perror("fork");
                exit(EXIT_FAILURE);
            } else if (pid == 0) {
                // Child process - execute the first command
                close(pipefd[0]); // Close the read end of the pipe
                dup2(pipefd[1], STDOUT_FILENO); // Redirect stdout to the pipe
                close(pipefd[1]); // Close the write end of the pipe

                args[pipeIndex] = NULL; // Terminate args for the first command

                execvp(args[0], args); // Execute the first command
                perror("execvp");
                exit(EXIT_FAILURE);
            } else {
                // Parent process - execute the second command
                wait(NULL);

                pid_t pid2 = fork();

                if (pid2 == -1) {
                    perror("fork");
                    exit(EXIT_FAILURE);
                } else if (pid2 == 0) {
                    close(pipefd[1]); // Close the write end of the pipe
                    dup2(pipefd[0], STDIN_FILENO); // Redirect stdin to the pipe
                    close(pipefd[0]); // Close the read end of the pipe

                    execvp(args[pipeIndex + 1], args + pipeIndex + 1); // Execute the second command
                    perror("execvp");
                    exit(EXIT_FAILURE);
                } else {
                    close(pipefd[0]);
                    close(pipefd[1]);
                    wait(NULL);
                }
            }
        
        }else if (doubleEndIndex >= 0) {
            addElement(history, &counter, input);
            doublePid = fork();

            if (doublePid == -1) {
                perror("fork");
                exit(EXIT_FAILURE);

            }else if (doublePid != 0){
                wait(0);
            } else if (doublePid == 0) {
                doublePid2 = fork();
                if (doublePid2 == 0){
                command = args[doubleEndIndex+1];
                int count1 = 1;
                int count2 = 0;
                while (args[doubleEndIndex + count1] != NULL){
                    args[count2] = args[doubleEndIndex + count1];
                    count2++;
                    count1++;
                }
                for(int i = count2; i < 12; i++){
                    args[i] = NULL;
                }
                }
                if(doublePid2 != 0){
                    wait(0);
                    command = args[0];
                    int count3 = 0;
                  
                    while (args[doubleEndIndex + count3] != NULL){
                        args[doubleEndIndex + count3] = NULL;
                        count3++;
                    }
              
                    for(int i = count3; i < 12; i++){
                        args[i] = NULL;
                    }
                     
                }
            } 
        }
        if (pipeIndex < 0) {
            // No pipe, execute single command
            if (command != NULL) {
                if (strcmp(command, "cd") == 0) {
                    addElement(history, &counter, input);
                    if (args[1] != NULL) {
                        if (chdir(args[1]) != 0) {
                            perror("chdir");
                        }
                    } else {
                        char *home = getenv("HOME");
                        if (home == NULL) {
                            printf("HOME environment variable not set.\n");
                        } else {
                            if (chdir(home) != 0) {
                                perror("chdir");
                            }
                        }
                    }
                } else if (strcmp(command, "pwd") == 0) {
                    if (args[1] == NULL) {
                        addElement(history, &counter, input);
                        char *directory = getcwd(output, sizeof(output));
                        printf("%s \n", directory);
                    } else if (args[1] != NULL) {
                        printf("command doesn't take any argument \n");
                    }
                } else if (strcmp(command, "history") == 0) {
                    if (args[1] == NULL) {
                        addElement(history, &counter, input);
                        printArray(history, counter);
                    } else if (args[1] != NULL) {
                        printf("command doesn't take any argument \n");
                    }
                } else if (strcmp(command, "exit") == 0) {
                    if (args[1] == NULL) {
                        addElement(history, &counter, input);
                        exit(0);
                    } else if (args[1] != NULL) {
                        printf("command doesn't take any argument \n");
                    }
                } else {
                    pid_t pid = fork();

                    if (pid == 0) {
                        execvp(command, args);
                        perror("execvp");
                        exit(EXIT_FAILURE);
                    } else if (pid > 0) {
                        wait(NULL);
                    } else {
                        printf("Unable to create child process.\n");
                    }
                }
            }
        }if (doubleEndIndex >= 0) {
            if (doublePid2 == 0){
                exit(0);
            }else{
                
            }
        }

     
    }
    return 0;
}
