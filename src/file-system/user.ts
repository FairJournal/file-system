export const ADD_USER_TEXT = 'I CONSENT to join {PROJECT_NAME}.'

/**
 * Creates text for user to sign
 */
export function makeAddUserText(projectName: string): string {
  return ADD_USER_TEXT.replace('{PROJECT_NAME}', projectName)
}
