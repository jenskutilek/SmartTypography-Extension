//
//  SafariExtensionViewController.swift
//  Smart Typography Extension
//
//  Created by J on 07.06.20.
//  Copyright © 2020 Jens Kutilek. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
