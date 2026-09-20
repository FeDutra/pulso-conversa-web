/*
Copyright 2019-2024 New Vector Ltd.
Copyright 2019 The Matrix.org Foundation C.I.C.
Copyright 2015, 2016 OpenMarket Ltd

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React from "react";
import classNames from "classnames";

import SdkConfig from "../../../SdkConfig";
import AuthFooter from "./AuthFooter";

interface IProps {
    /**
     * Whether to add a blurred shadow around the modal.
     *
     * If the modal component provides its own shadow or blurring, this can be
     * disabled.  Defaults to `true`.
     */
    addBlur?: boolean;
}

export default class AuthPage extends React.PureComponent<React.PropsWithChildren<IProps>> {
    private static welcomeBackgroundUrl?: string;

    // cache the url as a static to prevent it changing without refreshing
    private static getWelcomeBackgroundUrl(): string {
        if (AuthPage.welcomeBackgroundUrl) return AuthPage.welcomeBackgroundUrl;

        const brandingConfig = SdkConfig.getObject("branding");

        const urls = brandingConfig.get("welcome_background_url");
        if (Array.isArray(urls)) {
            const index = Math.floor(Math.random() * urls.length);
            AuthPage.welcomeBackgroundUrl = urls[index];
        } else {
            AuthPage.welcomeBackgroundUrl = urls;
        }

        return AuthPage.welcomeBackgroundUrl;
    }

    public render(): React.ReactElement {
        const isFio = SdkConfig.get("brand") === "FIO";
        const pageStyle = {
            background: isFio ? undefined : `center/cover fixed url(${AuthPage.getWelcomeBackgroundUrl()})`,
        };

        const modalStyle: React.CSSProperties = {
            position: "relative",
            background: "initial",
        };

        const blurStyle: React.CSSProperties = {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            filter: "blur(40px)",
            background: pageStyle.background,
        };

        const modalContentStyle: React.CSSProperties = {
            display: "flex",
            zIndex: 1,
            borderRadius: "inherit",
        };

        let modalBlur;
        if (this.props.addBlur !== false) {
            // Blur out the background: add a `div` which covers the content behind the modal,
            // and blurs it out.
            modalBlur = <div className="mx_AuthPage_modalBlur" style={blurStyle} />;
        }

        const modalClasses = classNames({
            mx_AuthPage_modal: true,
            mx_AuthPage_modal_withBlur: this.props.addBlur !== false,
        });

        return (
            <div className={classNames("mx_AuthPage", { "mx_AuthPage--fio": isFio })} style={pageStyle}>
                {isFio && (
                    <div className="fio_AuthAtmosphere" aria-hidden="true">
                        <span className="fio_AuthAtmosphereThread fio_AuthAtmosphereThread--horizontal" />
                        <span className="fio_AuthAtmosphereThread fio_AuthAtmosphereThread--vertical" />
                        <span className="fio_AuthAtmosphereMark">[ fio ]</span>
                        <span className="fio_AuthAtmosphereCaption">pulso · comunicação soberana</span>
                    </div>
                )}
                <div className={modalClasses} style={modalStyle}>
                    {modalBlur}
                    <main
                        className="mx_AuthPage_modalContent"
                        style={modalContentStyle}
                        tabIndex={-1}
                        aria-live="polite"
                    >
                        {this.props.children}
                    </main>
                </div>
                <AuthFooter />
            </div>
        );
    }
}
