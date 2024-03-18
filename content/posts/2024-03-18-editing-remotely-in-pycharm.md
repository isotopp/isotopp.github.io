---
author: isotopp
title: "Editing Remotely in PyCharm"
date: "2024-03-18T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- computer
- development
- python
---

A friend asks me on IRC:
> Do you happen to know how I can edit code locally on my PyCharm (MacOS, Professional)
> but run it remotely in a virtual environment?
> I know how to do that in VS Code, but I don't know how to do it in PyCharm, even with ssh configured and tested. 

The TL;DR is that this specific person has disabled the FTP/SFTP/Webdav Plugin in an attempt to configure PyCharm 
in a way that it doesn't upload development data to Jetbrains Servers or similar.

![](/uploads/2024/03/pycharm-01.jpg)

*The bundled FTP/SFTP/Webdav Plugin in Pycharm is required for the preferred deployment method.*

Jetbrains has several options for editing code locally, but deploying and running it remotely.

- Convert a local repository for remote deployment, and have it uploaded in an "rsync"-like fashion for each save to disk.
  This is not "rsync," because it also provides remote debugging and other features that reach further than synchronisation. 
- Run a headless version of Pycharm remotely using "Jetbrains Gateway," 
  showing the display locally, but running the editor remotely over ssh.
- Use Fleet, the VS Code imitation by Jetbrains.

# "Rsync Deployment"

1. Create a new project locally, using a local interpreter of your choice.

![](/uploads/2024/03/pycharm-02.jpg)

*Create a normal local project, not caring about remote edit.*

2. Convert the project to a new interpreter, using "Add Interpreter" in Settings→Project→Python Interpreter.

![](/uploads/2024/03/pycharm-03.jpg)

*Click on 'Add Interpreter...', select 'On SSH...'*

3. Choose an existing SSH Server (or add a new one)

![](/uploads/2024/03/pycharm-04.jpg)

*Here we select the remote box to work on. In our case, we are running on `server.local` as the user `kris`, 
using SSH agent authentication.
If the configuration we want were not present, we'd select 'SSH Connection: [ ] New' instead of an existing config.*

4. Let the probe complete.

![](/uploads/2024/03/pycharm-05.jpg)

*Selecting a SSH interpreter will spawn a remote Python version probe. We need to let this run and complete.*

5. Trying to set a remote work directory is useless at this stage.

![](/uploads/2024/03/pycharm-06.jpg)

*In my version of PyCharm (PyCharm 2023.3.4), trying to edit the remote sync folder in the final set is possible, 
but is being ignored later.
It will initially always use a random directory name in /tmp for remote execution, no matter how I configure it here.
This is likely a bug.*

6. Review Remote Interpreter Setup 

![](/uploads/2024/03/pycharm-07.jpg)

*Review the chosen interpreter. It should now say something about "Remote Python", 
and show the version number as detected for the remote box.*

7. Fix the Mappings

![](/uploads/2024/03/pycharm-08.jpg)

*Go to Settings→Build, Execution, Deployment→Deployment, select your configuration, select the tab "Mappings" and
check the "Deployment Path".
In my PyCharm, this is always a random path in `/tmp`, no matter what I do in the previous step 3.
I correct this to the directory I want this deployed in, here `/home/kris/Source/keks`, then click "Ok".*

8. Verify that it works

![](/uploads/2024/03/pycharm-09.jpg)

*Printing `sys.version_info` shows us that we are indeed running on the Python Version of the remote host.
We could also call `sys_info = os.uname()`, and print `sys_info.nodename` to check the name of the box.*

For my friend none of this worked. The entire SSH option was not shown, 
and the option to define SFTP upload was not offered.
Further debugging showed that my friend had tried to secure his installation against unwanted data upload,
disabling all remote AI functionality and also the 
[Jetbrains Settings Sync](https://www.jetbrains.com/help/pycharm/2023.1/sharing-your-ide-settings.html#IDE_settings_sync).
In doing that, they also inadvertantly disabled the "SSH/SFTP/Webdav" bundled plugin.

# Using "Jetbrains Gateway"

1. When closing all project windows, PyCharm will default to the project selection screen.
This will offer the creation of new local projects, and also access to "SSH" projects, 
"Jetbrains Space" projects, "Dev Containers".

![](/uploads/2024/03/pycharm-10.jpg)

*PyCharms project selection screen, "Welcome to PyCharm".
Choosing "SSH" sllows you to create remote projects directly.
This will not use the synchronisation method above, but start a remote headless PyCharm.*

2. Provide SSH connection information.

![](/uploads/2024/03/pycharm-11.jpg)

*We are then being asked to provide SSH connection information, and can again choose from our default targets.
Again, we use `kris@server.local` with agent authentication.*

3. Select IDE version and directory.

![](/uploads/2024/03/pycharm-12.jpg)

*We are then being asked to choose an IDE version, and a directory.
The directory must exist (and is ideally empty).*

This step can take some time to complete.
It will make the remote host download a version of the IDE and run it headless,
and will then configure Jetbrains Gateway locally.
Ultimately, it will hand off development from PyCharm to the local Gateway and the remotely running PyCharm.

Gateway acts as the local display of the remote IDE, using SSH as a remote procedure call mechanism.
Depending on the SSH connection latency, this can be quite laggy.
In older versions of Gateway, it was also prone to losing synchronization – this version seems to behave better.

4. Validate functionality and hostname

![](/uploads/2024/03/pycharm-13.jpg)

*Writing a short test program and running it quickly validates that we are on the correct version of Python
and on the correct host.*

5. Check processlist

[![](/uploads/2024/03/pycharm-14.jpg)](/uploads/2024/03/pycharm-14.jpg)

*A quick glance at the processlist of the remote hosts shows us what is going on:
A headless version of Pycharm has been downloaded to $HOME/.cache/JetBrains and is doing the work.
Locally, Jetbrains Gateway is the display for the remote instance.*

6. Check connection and ressources

![](/uploads/2024/03/pycharm-15.jpg)

*Cloud development instances are sometimes optimized for cost, not for comfort.
Gateway offers a way to check remote resources, including Ping and Memory.*

7. Other Providers

![](/uploads/2024/03/pycharm-16.jpg)

*Gateway also offers additional providers for remote development, which can be installed and configured.*

# Fleet

Fleet is a new editing environment from Jetbrains that tries to emulate VC Code in look and feel.
Unlike PyCharm, it has no direct language support, but connects to one or more language servers.
It needs extensions and language servers to become a useful editor with syntax support and analytics.

It can natively edit remote files.

I am not comfortable using it, and have therefore not tested it.

# Preference

For my deployment scenarios, I prefer to work with the primary approach 
of converting a local project to a remote deployment using the "rsync" approach.
It is less sensitive to latency and less fragile than the "Gateway" approach, and offers much the same functionality for me.

People using standard clouds more than I do might fare better with "Gateway," now that it is stable.

People using multiple languages in the same project or dependent on LSP and language servers might like Fleet better.
