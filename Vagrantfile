# -*- mode: ruby -*-
# vi: set ft=ruby :

# TODO provision sudo agt-get install python-pip
# dl pylast
#  sudo python setup.py install

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.hostname = "pythondev"

  # config.vm.network "forwarded_port", guest: 80, host: 8080
  # config.vm.network "private_network", ip: "192.168.33.10"
   config.vm.network "public_network"

  # config.ssh.forward_agent = true
  # config.vm.synced_folder "../data", "/vagrant_data"

end