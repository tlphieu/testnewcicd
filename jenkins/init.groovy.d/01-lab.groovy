import jenkins.model.Jenkins
import hudson.security.HudsonPrivateSecurityRealm
import hudson.security.FullControlOnceLoggedInAuthorizationStrategy
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition

def j = Jenkins.get()
if (!(j.securityRealm instanceof HudsonPrivateSecurityRealm)) {
    def realm = new HudsonPrivateSecurityRealm(false)
    realm.createAccount('labadmin', new File('/run/secrets/admin_password').text.trim())
    j.setSecurityRealm(realm)
    def auth = new FullControlOnceLoggedInAuthorizationStrategy()
    auth.setAllowAnonymousRead(false)
    j.setAuthorizationStrategy(auth)
}
j.setNumExecutors(1)
if (j.getItem('user-api-local') == null) {
    def job = j.createProject(WorkflowJob, 'user-api-local')
    job.setDescription('Local demonstration: copies current source read-only; no GitHub push or production deployment.')
    job.setDefinition(new CpsFlowDefinition(new File('/source/jenkins/Jenkinsfile.local').text, true))
    job.save()
}
j.save()
